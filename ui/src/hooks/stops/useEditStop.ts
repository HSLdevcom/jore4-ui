import flow from 'lodash/flow';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import {
  EditStopMutationVariables,
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  RouteAllFieldsFragment,
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
  useEditStopMutation,
  useGetRoutesBrokenByStopChangeAsyncQuery,
  useGetStopWithRouteGraphDataByIdAsyncQuery,
} from '../../generated/graphql';
import {
  ScheduledStopPointSetInput,
  mapGetRoutesBrokenByStopChangeResult,
  mapStopResultToStop,
} from '../../graphql';
import {
  DirectionNotResolvedError,
  EditRouteTerminalStopsError,
  IncompatibleDirectionsError,
  IncompatibleWithExistingRoutesError,
  InternalError,
  LinkNotResolvedError,
  TimingPlaceRequiredError,
  defaultTo,
  showDangerToast,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';
import { useValidateTimingSettings } from './useValidateTimingSettings';

interface EditParams {
  stopId: UUID;
  patch: ScheduledStopPointSetInput;
}

export interface EditChanges {
  stopId: UUID;
  stopLabel: string;
  patch: ScheduledStopPointSetInput;
  editedStop: ServicePatternScheduledStopPoint;
  deleteStopFromRoutes: RouteUniqueFieldsFragment[];
  deleteStopFromJourneyPatternIds?: UUID[];
  conflicts?: ServicePatternScheduledStopPoint[];
}

export interface BrokenRouteCheckParams {
  newLink: InfrastructureNetworkInfrastructureLink;
  newDirection: InfrastructureNetworkDirectionEnum;
  newStop: ScheduledStopPointSetInput;
  label: string;
  priority: number;
  stopId: UUID | null;
}

export const isEditChanges = (
  input: Record<string, ExplicitAny>,
): input is EditChanges => {
  return !!input.editedStop;
};

export const useEditStop = () => {
  const { t } = useTranslation();
  const [editStopMutation] = useEditStopMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdAsyncQuery();
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();
  const [getBrokenRoutes] = useGetRoutesBrokenByStopChangeAsyncQuery();
  const [validateTimingSettings] = useValidateTimingSettings();

  const getRoutesBrokenByStopChange = async ({
    newLink,
    newDirection,
    newStop,
    label,
    priority,
    stopId,
  }: BrokenRouteCheckParams) => {
    // if a stop is moved away from the route geometry, remove it from its journey patterns
    const brokenRoutesResult = await getBrokenRoutes({
      new_located_on_infrastructure_link_id: newLink.infrastructure_link_id,
      new_direction: newDirection,
      new_label: label,
      new_validity_start: newStop.validity_start,
      new_validity_end: newStop.validity_end,
      new_priority: priority,
      replace_scheduled_stop_point_id: stopId,
      // data model and form validation should ensure that
      // measured_location always exists
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      new_measured_location: newStop.measured_location!,
    });

    const brokenRouteList =
      mapGetRoutesBrokenByStopChangeResult(brokenRoutesResult);

    const brokenJourneyPatternIds = brokenRouteList
      ? brokenRouteList?.map((route) => route.journey_pattern_id)
      : [];
    const brokenRoutes = brokenRouteList
      ? brokenRouteList?.map(
          (route) => route.journey_pattern_route as RouteAllFieldsFragment,
        )
      : [];

    return { brokenJourneyPatternIds, brokenRoutes };
  };

  const onStopLocationChanged = async (
    oldStop: ServicePatternScheduledStopPoint,
    newStop: ScheduledStopPointSetInput,
    stopId: UUID,
  ) => {
    // if we modified the location of the stop, have to also fetch the new infra link and direction
    const { closestLink, direction } = await getStopLinkAndDirection({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stopLocation: newStop.measured_location!,
    });

    const {
      brokenJourneyPatternIds: deleteStopFromJourneyPatternIds,
      brokenRoutes: deleteStopFromRoutes,
    } = await getRoutesBrokenByStopChange({
      newLink: closestLink,
      newDirection: direction,
      newStop,
      label: newStop.label || oldStop.label,
      priority: newStop.priority || oldStop.priority,
      stopId,
    });

    const locationChanges: Partial<EditChanges> = {
      patch: {
        located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
        direction,
      },
      deleteStopFromJourneyPatternIds,
      deleteStopFromRoutes,
    };

    return locationChanges;
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareEdit = async ({ stopId, patch }: EditParams) => {
    const stopWithRoutesResult = await getStopWithRouteGraphData({ stopId });
    const stopWithRouteGraphData = mapStopResultToStop(stopWithRoutesResult);

    // data model and form validation should ensure that
    // label always exists
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stopLabel = defaultTo(patch.label, stopWithRouteGraphData?.label)!;

    const hasEditedValidity =
      !!stopWithRouteGraphData &&
      (patch.label !== stopWithRouteGraphData.label ||
        patch.priority !== stopWithRouteGraphData?.priority ||
        patch.validity_start !== stopWithRouteGraphData?.validity_start ||
        patch.validity_end !== stopWithRouteGraphData?.validity_end);

    const conflicts = hasEditedValidity
      ? await getConflictingStops(
          {
            label: stopLabel,
            // data model and form validation should ensure that
            // priority always exists
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            priority: defaultTo(
              patch.priority,
              stopWithRouteGraphData?.priority,
            )!,
            validityStart:
              defaultTo(
                patch.validity_start,
                stopWithRouteGraphData?.validity_start,
              ) || undefined,
            validityEnd:
              defaultTo(
                patch.validity_end,
                stopWithRouteGraphData?.validity_end,
              ) || undefined,
          },
          stopId,
        )
      : [];

    if (!stopWithRouteGraphData) {
      throw new InternalError(`Could not find stop with id ${stopId}`);
    }

    // changes that will always be applied
    const defaultChanges = {
      stopId,
      stopLabel,
      patch,
      deleteStopFromRoutes: [],
      deleteStopFromJourneyPatterns: [],
      conflicts,
    };

    // changes that are applied if the stop's location is changed
    const newLocation = patch.measured_location;
    const oldLocation = stopWithRouteGraphData.measured_location;
    const hasLocationChanged =
      newLocation && !isEqual(newLocation, oldLocation);
    const locationChanges = hasLocationChanged
      ? await onStopLocationChanged(stopWithRouteGraphData, patch, stopId)
      : {};

    // validate stop's timing settings in journey patterns if stop's timing place has been changed
    const newTimingPlaceId = patch.timing_place_id;
    const oldTimingPlaceId = stopWithRouteGraphData.timing_place_id;
    const hasTimingPlaceIdChanged = !isEqual(
      newTimingPlaceId,
      oldTimingPlaceId,
    );

    if (hasTimingPlaceIdChanged) {
      await validateTimingSettings({
        stopLabel,
        timingPlaceId: newTimingPlaceId,
      });
    }

    const mergedChanges = merge({}, defaultChanges, locationChanges);

    const finalChanges: EditChanges = {
      ...mergedChanges,
      // the final state of the stop that will be after patching
      editedStop: merge({}, stopWithRouteGraphData, mergedChanges.patch),
    };

    return finalChanges;
  };

  const mapEditChangesToVariables = (changes: EditChanges) => {
    const variables: EditStopMutationVariables = {
      stop_id: changes.stopId,
      stop_label: changes.stopLabel,
      stop_patch: changes.patch,
      delete_from_journey_pattern_ids:
        changes.deleteStopFromJourneyPatternIds || [],
    };
    return variables;
  };

  const prepareAndExecute = flow(
    prepareEdit,
    mapEditChangesToVariables,
    editStopMutation,
  );

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    if (err instanceof LinkNotResolvedError) {
      showDangerToast(t('stops.fetchClosestLinkFailed'));
      return;
    }
    if (err instanceof DirectionNotResolvedError) {
      showDangerToast(t('stops.fetchDirectionFailed'));
      return;
    }
    if (err instanceof IncompatibleDirectionsError) {
      showDangerToast(t('stops.incompatibleDirections'));
      return;
    }
    if (err instanceof EditRouteTerminalStopsError) {
      showDangerToast(t('stops.cannotEditTerminalStops'));
    }
    if (err instanceof IncompatibleWithExistingRoutesError) {
      showDangerToast(
        t('stops.stopBreaksRoutes', { routeLabels: err.message }),
      );
      return;
    }
    if (err instanceof TimingPlaceRequiredError) {
      showDangerToast(
        t('stops.timingPlaceRequired', { routeLabels: err.message }),
      );
      return;
    }
    // if other error happened, show the generic error message
    showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };

  return {
    prepareEdit,
    mapEditChangesToVariables,
    editStopMutation,
    prepareAndExecute,
    defaultErrorHandler,
    getRoutesBrokenByStopChange,
  };
};
