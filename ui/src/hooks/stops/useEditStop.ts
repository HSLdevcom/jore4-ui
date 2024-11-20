import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  EditStopMutationVariables,
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  RouteAllFieldsFragment,
  RouteUniqueFieldsFragment,
  ScheduledStopPointAllFieldsFragment,
  ServicePatternScheduledStopPoint,
  StopRegistryGeoJsonType,
  StopRegistryStopPlace,
  StopRegistryStopPlaceInput,
  useEditStopMutation,
  useEditStopPlaceMutation,
  useGetRoutesBrokenByStopChangeLazyQuery,
  useGetStopWithRouteGraphDataByIdLazyQuery,
} from '../../generated/graphql';
import {
  ScheduledStopPointSetInput,
  mapGetRoutesBrokenByStopChangeResult,
  mapStopResultToStop,
} from '../../graphql';
import { setIsMoveStopModeEnabledAction } from '../../redux';
import {
  DirectionNotResolvedError,
  EditRouteTerminalStopsError,
  IncompatibleDirectionsError,
  IncompatibleWithExistingRoutesError,
  InternalError,
  LinkNotResolvedError,
  TiamatUpdateFailedError,
  TimingPlaceRequiredError,
  defaultTo,
  patchKeyValues,
  removeFromApolloCache,
  showDangerToast,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';
import { useValidateTimingSettings } from './useValidateTimingSettings';

const GQL_GET_ROUTES_BROKEN_BY_STOP_CHANGE = gql`
  query GetRoutesBrokenByStopChange(
    $new_located_on_infrastructure_link_id: uuid!
    $new_direction: String!
    $new_label: String!
    $new_validity_start: date
    $new_validity_end: date
    $new_priority: Int!
    $new_measured_location: geography!
    $replace_scheduled_stop_point_id: uuid
  ) {
    journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point(
      args: {
        replace_scheduled_stop_point_id: $replace_scheduled_stop_point_id
        new_located_on_infrastructure_link_id: $new_located_on_infrastructure_link_id
        new_direction: $new_direction
        new_label: $new_label
        new_validity_start: $new_validity_start
        new_validity_end: $new_validity_end
        new_priority: $new_priority
        new_measured_location: $new_measured_location
      }
    ) {
      journey_pattern_id
      journey_pattern_route {
        ...route_all_fields
      }
    }
  }
`;

const GQL_EDIT_STOP = gql`
  mutation EditStop(
    $stop_id: uuid!
    $stop_label: String!
    $stop_patch: service_pattern_scheduled_stop_point_set_input!
    $delete_from_journey_pattern_ids: [uuid!]!
  ) {
    # edit the stop itself
    update_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stop_id } }
      _set: $stop_patch
    ) {
      returning {
        ...scheduled_stop_point_all_fields
      }
    }

    # delete the stop from the following journey patterns
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        _and: {
          scheduled_stop_point_label: { _eq: $stop_label }
          journey_pattern_id: { _in: $delete_from_journey_pattern_ids }
        }
      }
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
`;

const GQL_EDIT_STOP_PLACE = gql`
  mutation EditStopPlace($patch: stop_registry_StopPlaceInput) {
    stop_registry {
      mutateStopPlace(StopPlace: $patch) {
        id
        version

        name {
          value
        }

        geometry {
          coordinates
        }

        keyValues {
          key
          values
        }
      }
    }
  }
`;

interface EditParams {
  stopId: UUID;
  stopPlaceRef?: string | null;
  patch: ScheduledStopPointSetInput;
}

export interface EditChanges {
  stopId: UUID;
  stopLabel: string;
  patch: ScheduledStopPointSetInput;
  stopPlacePatch: StopRegistryStopPlaceInput | null;
  editedStop: ScheduledStopPointAllFieldsFragment;
  deleteStopFromRoutes: RouteUniqueFieldsFragment[];
  deleteStopFromJourneyPatternIds?: UUID[];
  conflicts?: ScheduledStopPointAllFieldsFragment[];
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

function mapEditChangesToVariables(
  changes: EditChanges,
): EditStopMutationVariables {
  return {
    stop_id: changes.stopId,
    stop_label: changes.stopLabel,
    stop_patch: changes.patch,
    delete_from_journey_pattern_ids:
      changes.deleteStopFromJourneyPatternIds ?? [],
  };
}

function stopPointPatchToStopPlacePatch(
  stopPlaceRef: string | null | undefined,
  patch: ScheduledStopPointSetInput,
  stopPlace: Pick<StopRegistryStopPlace, 'keyValues'> | null,
): StopRegistryStopPlaceInput | null {
  if (!stopPlaceRef) {
    return null;
  }

  const stopPlacePatch: StopRegistryStopPlaceInput = {
    id: stopPlaceRef,

    name: patch.label
      ? {
          lang: 'fin',
          value: patch.label,
        }
      : undefined,

    geometry: patch.measured_location
      ? {
          type: StopRegistryGeoJsonType.Point,
          // Including the possible 3rd number in the coordinates throws Timat off
          // causing it to try and parse this as List<List<List<Double>>> instead
          // of the actual List<Double>.
          coordinates: patch.measured_location.coordinates.slice(0, 2),
        }
      : undefined,

    keyValues:
      (patch.priority ?? patch.validity_start ?? patch.validity_end)
        ? patchKeyValues(
            stopPlace,
            compact([
              patch.priority
                ? {
                    key: 'priority',
                    values: [patch.priority.toString(10)],
                  }
                : undefined,
              patch.validity_start
                ? {
                    key: 'validityStart',
                    values: [patch.validity_start.toISODate()],
                  }
                : undefined,
              patch.validity_end
                ? {
                    key: 'validityEnd',
                    values: [patch.validity_end.toISODate()],
                  }
                : undefined,
            ]),
          )
        : undefined,
  };

  // If there are no actual changes -> null
  const changedFields = Object.entries(stopPlacePatch)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value)
    .map(([key]) => key);
  if (isEqual(changedFields, ['id'])) {
    return null;
  }

  return stopPlacePatch;
}

type GetRoutesBrokenByStopChangeResult = {
  readonly brokenJourneyPatternIds: Array<string>;
  readonly brokenRoutes: Array<RouteAllFieldsFragment>;
};

export function useGetRoutesBrokenByStopChange() {
  const [getBrokenRoutes] = useGetRoutesBrokenByStopChangeLazyQuery();

  return async ({
    newLink,
    newDirection,
    newStop,
    label,
    priority,
    stopId,
  }: BrokenRouteCheckParams): Promise<GetRoutesBrokenByStopChangeResult> => {
    // if a stop is moved away from the route geometry, remove it from its journey patterns
    const brokenRoutesResult = await getBrokenRoutes({
      variables: {
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
      },
    });

    const brokenRouteList =
      mapGetRoutesBrokenByStopChangeResult(brokenRoutesResult);

    const brokenJourneyPatternIds = brokenRouteList.map(
      (route) => route.journey_pattern_id,
    );
    const brokenRoutes = brokenRouteList.map(
      (route) => route.journey_pattern_route as RouteAllFieldsFragment,
    );

    return { brokenJourneyPatternIds, brokenRoutes };
  };
}

function useGetConflictingStops() {
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();

  return async (
    stopId: string,
    label: string,
    patch: ScheduledStopPointSetInput,
    stopWithRouteGraphData: ServicePatternScheduledStopPoint,
  ) => {
    const hasEditedValidity =
      patch.label !== stopWithRouteGraphData.label ||
      patch.priority !== stopWithRouteGraphData?.priority ||
      patch.validity_start !== stopWithRouteGraphData?.validity_start ||
      patch.validity_end !== stopWithRouteGraphData?.validity_end;

    if (!hasEditedValidity) {
      return [];
    }

    return getConflictingStops(
      {
        label,
        priority: defaultTo(patch.priority, stopWithRouteGraphData.priority),
        validityStart:
          defaultTo(
            patch.validity_start,
            stopWithRouteGraphData.validity_start,
          ) ?? undefined,
        validityEnd:
          defaultTo(patch.validity_end, stopWithRouteGraphData.validity_end) ??
          undefined,
      },
      stopId,
    );
  };
}

type OnStopLocationChangedResult = Pick<
  EditChanges,
  'patch' | 'deleteStopFromJourneyPatternIds' | 'deleteStopFromRoutes'
>;

function useOnStopLocationChanged() {
  const getRoutesBrokenByStopChange = useGetRoutesBrokenByStopChange();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();

  return async (
    oldStop: ScheduledStopPointAllFieldsFragment,
    newStop: ScheduledStopPointSetInput,
    stopId: UUID,
  ): Promise<OnStopLocationChangedResult> => {
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
      label: newStop.label ?? oldStop.label,
      priority: newStop.priority ?? oldStop.priority,
      stopId,
    });

    return {
      patch: {
        located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
        direction,
      },
      deleteStopFromJourneyPatternIds,
      deleteStopFromRoutes,
    };
  };
}

function useGetLocationChanges() {
  const onStopLocationChanged = useOnStopLocationChanged();

  return async (
    stopId: string,
    patch: ScheduledStopPointSetInput,
    stopWithRouteGraphData: ServicePatternScheduledStopPoint,
  ): Promise<Partial<OnStopLocationChangedResult>> => {
    const newLocation = patch.measured_location;
    const oldLocation = stopWithRouteGraphData.measured_location;

    const hasLocationChanged =
      newLocation && !isEqual(newLocation.coordinates, oldLocation.coordinates);

    if (!hasLocationChanged) {
      return {};
    }

    return onStopLocationChanged(stopWithRouteGraphData, patch, stopId);
  };
}

function useValidateTimingPlaceChanges() {
  const [validateTimingSettings] = useValidateTimingSettings();

  return async (
    stopLabel: string,
    patch: ScheduledStopPointSetInput,
    stopWithRouteGraphData: ServicePatternScheduledStopPoint,
  ) => {
    if (patch.timing_place_id === undefined) {
      return;
    }

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
  };
}

// prepare variables for mutation and validate if it's even allowed
// try to produce a changeset that can be displayed on an explanatory UI
function usePrepareEdit() {
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdLazyQuery();

  const getConflictingStops = useGetConflictingStops();
  const getLocationChanges = useGetLocationChanges();
  const validateTimingPlaceChanges = useValidateTimingPlaceChanges();

  return async ({
    stopId,
    stopPlaceRef,
    patch,
  }: EditParams): Promise<EditChanges> => {
    const stopWithRoutesResult = await getStopWithRouteGraphData({
      variables: { stopId },
    });

    const stopWithRouteGraphData = mapStopResultToStop(stopWithRoutesResult);

    if (!stopWithRouteGraphData) {
      throw new InternalError(`Could not find stop with id ${stopId}`);
    }

    const stopLabel = defaultTo(patch.label, stopWithRouteGraphData.label);

    // changes that will always be applied
    const defaultChanges: Omit<
      EditChanges,
      'editedStop' | 'conflicts' | 'stopPlacePatch'
    > = {
      stopId,
      stopLabel,
      patch,
      deleteStopFromRoutes: [],
      deleteStopFromJourneyPatternIds: [],
    };

    // Perform async tasks in parallel to speed things up.
    const [conflicts, locationChanges] = await Promise.all([
      getConflictingStops(stopId, stopLabel, patch, stopWithRouteGraphData),
      // changes that are applied if the stop's location is changed
      getLocationChanges(stopId, patch, stopWithRouteGraphData),
      // validate stop's timing settings in journey patterns if stop's timing place has been changed
      validateTimingPlaceChanges(stopLabel, patch, stopWithRouteGraphData),
    ]);

    const mergedChanges = merge(
      {},
      defaultChanges,
      { conflicts },
      locationChanges,
    );

    return {
      ...mergedChanges,
      stopPlacePatch: stopPointPatchToStopPlacePatch(
        stopPlaceRef,
        mergedChanges.patch,
        stopWithRouteGraphData.stop_place?.find(
          (stopPlace) =>
            stopPlace && stopPlaceRef && stopPlace.id === stopPlaceRef,
        ) ?? null,
      ),
      // the final state of the stop that will be after patching
      editedStop: merge({}, stopWithRouteGraphData, mergedChanges.patch),
    };
  };
}

// default handler that can be used to show error messages as toast
// in case an exception is thrown
function useDefaultErrorHandler() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (err: Error) => {
    if (err instanceof LinkNotResolvedError) {
      return showDangerToast(t('stops.fetchClosestLinkFailed'));
    }

    if (err instanceof DirectionNotResolvedError) {
      return showDangerToast(t('stops.fetchDirectionFailed'));
    }

    if (err instanceof IncompatibleDirectionsError) {
      return showDangerToast(t('stops.incompatibleDirections'));
    }

    if (err instanceof EditRouteTerminalStopsError) {
      return showDangerToast(t('stops.cannotEditTerminalStops'));
    }

    if (err instanceof IncompatibleWithExistingRoutesError) {
      return showDangerToast(
        t('stops.stopBreaksRoutes', { routeLabels: err.message }),
      );
    }

    if (err instanceof TimingPlaceRequiredError) {
      dispatch(setIsMoveStopModeEnabledAction(false));
      return showDangerToast(
        t('stops.timingPlaceRequired', { routeLabels: err.message }),
      );
    }

    if (err instanceof TiamatUpdateFailedError) {
      showDangerToast(
        t('stops.tiamatUpdateFailed', { errorMessage: err.causeMessage }),
      );
    }

    // if other error happened, show the generic error message
    return showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };
}

export const useEditStop = () => {
  const [editStopMutation] = useEditStopMutation();
  const [editStopPlaceMutation] = useEditStopPlaceMutation();

  const prepareEdit = usePrepareEdit();
  const defaultErrorHandler = useDefaultErrorHandler();

  const editStop = async (changes: EditChanges) => {
    const variables = mapEditChangesToVariables(changes);
    const editStopResult = await editStopMutation({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          infrastructure_link_id:
            variables.stop_patch.located_on_infrastructure_link_id,
          __typename: 'infrastructure_network_infrastructure_link',
        });
      },
    });

    // If not associated with a stop place
    if (!changes.stopPlacePatch) {
      return { editStopResult, editStopPlaceResult: null };
    }

    // Try to also update the details into the associated stop place in Tiamat
    try {
      const editStopPlaceResult = await editStopPlaceMutation({
        variables: { patch: changes.stopPlacePatch },
      });

      return { editStopResult, editStopPlaceResult };
    } catch (e) {
      throw new TiamatUpdateFailedError(
        'Failed to update Stop Place in Tiamat!',
        { cause: e },
      );
    }
  };

  return {
    editStop,
    prepareEdit,
    defaultErrorHandler,
  };
};
