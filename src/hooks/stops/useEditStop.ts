import flow from 'lodash/flow';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import {
  EditStopMutationVariables,
  JourneyPatternJourneyPattern,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useEditStopMutation,
  useGetStopWithRouteGraphDataByIdAsyncQuery,
} from '../../generated/graphql';
import {
  mapGetStopWithRouteGraphDataByIdResult,
  ScheduledStopPointSetInput,
} from '../../graphql';
import {
  defaultTo,
  DirectionNotResolvedError,
  EditRouteTerminalStopsError,
  IncompatibleDirectionsError,
  InternalError,
  LinkNotResolvedError,
  showDangerToast,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';
import { getRoutesOfJourneyPatterns } from './utils';

interface EditParams {
  stopId: UUID;
  patch: ScheduledStopPointSetInput;
}

export interface EditChanges {
  stopId: UUID;
  patch: ScheduledStopPointSetInput;
  editedStop: ServicePatternScheduledStopPoint;
  deleteStopFromRoutes: RouteRoute[];
  deleteStopFromJourneyPatterns: JourneyPatternJourneyPattern[];
  conflicts?: ServicePatternScheduledStopPoint[];
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

  // find all route geometries from which this stop has been removed
  const getJourneyPatternsToDeleteStopFrom = (
    stopNewLinkId: UUID,
    stopWithRouteGraphData?: ServicePatternScheduledStopPoint,
  ) => {
    if (!stopWithRouteGraphData) {
      return [];
    }

    return (
      stopWithRouteGraphData.scheduled_stop_point_in_journey_patterns
        // we are interested in journey patterns
        .map((item) => item.journey_pattern)
        // check all the journey patterns' routes that this stop is currently part of
        .filter((journeyPattern) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const route = journeyPattern.journey_pattern_route!;

          // check if new link is still part of a route's geometry
          const isNewLinkPartOfRouteGeometry =
            route.infrastructure_links_along_route.some(
              (link) => link.infrastructure_link_id === stopNewLinkId,
            );

          // if new link is not part of the route's existing geometry, the stop should be removed from it
          return !isNewLinkPartOfRouteGeometry;
        })
    );
  };

  const onStopLocationChanged = async (
    newLocation: GeoJSON.Point,
    stopWithRouteGraphData: ServicePatternScheduledStopPoint,
  ) => {
    // if we modified the location of the stop, have to also fetch the new infra link and direction
    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation: newLocation,
    });

    // if a stop is moved away from the route geometry, remove it from its journey patterns
    const deleteStopFromJourneyPatterns = getJourneyPatternsToDeleteStopFrom(
      closestLink.infrastructure_link_id,
      stopWithRouteGraphData,
    );
    const deleteStopFromRoutes = getRoutesOfJourneyPatterns(
      deleteStopFromJourneyPatterns,
    );

    const locationChanges: Partial<EditChanges> = {
      patch: {
        located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
        direction,
      },
      deleteStopFromJourneyPatterns,
      deleteStopFromRoutes,
    };

    return locationChanges;
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareEdit = async ({ stopId, patch }: EditParams) => {
    const stopWithRoutesResult = await getStopWithRouteGraphData({ stopId });
    const stopWithRouteGraphData =
      mapGetStopWithRouteGraphDataByIdResult(stopWithRoutesResult);

    const hasEditedValidity =
      !!stopWithRouteGraphData &&
      (patch.label !== stopWithRouteGraphData.label ||
        patch.priority !== stopWithRouteGraphData?.priority ||
        patch.validity_start !== stopWithRouteGraphData?.validity_start ||
        patch.validity_end !== stopWithRouteGraphData?.validity_end);

    const conflicts = hasEditedValidity
      ? await getConflictingStops(
          {
            // data model and form validation should ensure that
            // label and priority always exist
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            label: defaultTo(patch.label, stopWithRouteGraphData?.label)!,
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
      ? await onStopLocationChanged(newLocation, stopWithRouteGraphData)
      : {};

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
      stop_patch: changes.patch,
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
  };
};
