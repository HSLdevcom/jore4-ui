import { gql } from '@apollo/client';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import {
  EditStopMutationVariables,
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  RouteAllFieldsFragment,
  RouteUniqueFieldsFragment,
  ScheduledStopPointAllFieldsFragment,
  ServicePatternScheduledStopPoint,
  StopRegistryQuay,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
  useEditStopMutation,
  useEditStopPlaceMutation,
  useGetRoutesBrokenByStopChangeLazyQuery,
  useGetStopWithRouteGraphDataByIdLazyQuery,
} from '../../../../generated/graphql';
import {
  PartialScheduledStopPointSetInput,
  mapGetRoutesBrokenByStopChangeResult,
  mapStopResultToStop,
} from '../../../../graphql';
import {
  DirectionNotResolvedError,
  EditRouteTerminalStopsError,
  IncompatibleDirectionsError,
  IncompatibleWithExistingRoutesError,
  InternalError,
  LinkNotResolvedError,
  StopPointUpdateFailed,
  TiamatUpdateFailedError,
  TimingPlaceRequiredError,
  defaultTo,
  removeFromApolloCache,
  showDangerToast,
} from '../../../../utils';
import { useCheckValidityAndPriorityConflicts } from '../../../common/hooks/useCheckValidityAndPriorityConflicts';
import { wrapErrors } from '../../../stop-registry/stops/stop-details/stop-version/utils/wrapErrors';
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

type EditParams = {
  readonly stopLabel: string;
  readonly stopId: UUID;
  readonly stopPointPatch: PartialScheduledStopPointSetInput;
  readonly stopPlaceId: string;
  readonly quayId: string;
  readonly quayPatch: StopRegistryQuayInput;
};

export type EditChanges = {
  readonly stopId: UUID;
  readonly stopLabel: string;
  readonly stopPointPatch: PartialScheduledStopPointSetInput | null;
  readonly stopPlacePatch: StopRegistryStopPlaceInput | null;
  readonly editedStop: ScheduledStopPointAllFieldsFragment;
  readonly deleteStopFromRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
  readonly deleteStopFromJourneyPatternIds?: ReadonlyArray<UUID>;
  readonly conflicts?: ReadonlyArray<ScheduledStopPointAllFieldsFragment>;
  readonly quayId: string;
};

export type BrokenRouteCheckParams = {
  readonly newLink: InfrastructureNetworkInfrastructureLink;
  readonly newDirection: InfrastructureNetworkDirectionEnum;
  readonly newStop: PartialScheduledStopPointSetInput;
  readonly label: string;
  readonly priority: number;
  readonly stopId: UUID | null;
};

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
    stop_patch: changes.stopPointPatch ?? {},
    delete_from_journey_pattern_ids:
      changes.deleteStopFromJourneyPatternIds ?? [],
  };
}

function quayPatchToStopPlacePatch(
  stopPlaceId: string | null | undefined,
  quayId: string | null | undefined,
  quayPatch: Pick<StopRegistryQuay, 'keyValues'> | null,
): StopRegistryStopPlaceInput | null {
  if (!stopPlaceId || !quayId) {
    return null;
  }

  const quayPatchWithId = { ...quayPatch, id: quayId };

  // If there are no actual changes -> null
  const changedFields = Object.entries(quayPatchWithId)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value)
    .map(([key]) => key);

  if (isEqual(changedFields, ['id'])) {
    return null;
  }

  return { id: stopPlaceId, quays: [quayPatchWithId] };
}

type GetRoutesBrokenByStopChangeResult = {
  readonly brokenJourneyPatternIds: ReadonlyArray<string>;
  readonly brokenRoutes: ReadonlyArray<RouteAllFieldsFragment>;
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

function hasStopPointFieldChanged(
  patch: PartialScheduledStopPointSetInput,
  existing: ServicePatternScheduledStopPoint,
  field: 'priority' | 'validity_start' | 'validity_end',
) {
  if (field in patch) {
    return patch[field] !== existing[field];
  }

  return false;
}

function useGetConflictingStops() {
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();

  return async (
    stopId: string,
    label: string,
    patch: PartialScheduledStopPointSetInput,
    existing: ServicePatternScheduledStopPoint,
  ) => {
    const hasEditedValidity =
      hasStopPointFieldChanged(patch, existing, 'priority') ||
      hasStopPointFieldChanged(patch, existing, 'validity_start') ||
      hasStopPointFieldChanged(patch, existing, 'validity_end');

    if (!hasEditedValidity) {
      return [];
    }

    return getConflictingStops(
      {
        label,
        priority: defaultTo(patch.priority, existing.priority),
        validityStart:
          defaultTo(patch.validity_start, existing.validity_start) ?? undefined,
        validityEnd:
          defaultTo(patch.validity_end, existing.validity_end) ?? undefined,
      },
      stopId,
    );
  };
}

type OnStopLocationChangedResult = Pick<
  EditChanges,
  'stopPointPatch' | 'deleteStopFromJourneyPatternIds' | 'deleteStopFromRoutes'
>;

function useOnStopLocationChanged() {
  const getRoutesBrokenByStopChange = useGetRoutesBrokenByStopChange();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();

  return async (
    oldStop: ScheduledStopPointAllFieldsFragment,
    newStop: PartialScheduledStopPointSetInput,
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
      stopPointPatch: {
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
    patch: PartialScheduledStopPointSetInput,
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
    patch: PartialScheduledStopPointSetInput,
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
export function usePrepareEdit() {
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdLazyQuery();

  const getConflictingStops = useGetConflictingStops();
  const getLocationChanges = useGetLocationChanges();
  const validateTimingPlaceChanges = useValidateTimingPlaceChanges();

  return async ({
    stopLabel,
    stopId,
    stopPointPatch,
    stopPlaceId,
    quayId,
    quayPatch,
  }: EditParams): Promise<EditChanges> => {
    const stopWithRoutesResult = await getStopWithRouteGraphData({
      variables: { stopId },
    });

    const stopWithRouteGraphData = mapStopResultToStop(stopWithRoutesResult);

    if (!stopWithRouteGraphData) {
      throw new InternalError(`Could not find stop with id ${stopId}`);
    }

    // changes that will always be applied
    const defaultChanges: Omit<
      EditChanges,
      'editedStop' | 'conflicts' | 'stopPlacePatch'
    > = {
      stopId,
      stopLabel,
      stopPointPatch,
      deleteStopFromRoutes: [],
      deleteStopFromJourneyPatternIds: [],
      quayId,
    };

    // Perform async tasks in parallel to speed things up.
    const [conflicts, locationChanges] = await Promise.all([
      getConflictingStops(
        stopId,
        stopLabel,
        stopPointPatch,
        stopWithRouteGraphData,
      ),

      // changes that are applied if the stop's location is changed
      getLocationChanges(stopId, stopPointPatch, stopWithRouteGraphData),

      // validate stop's timing settings in journey patterns if stop's timing place has been changed
      validateTimingPlaceChanges(
        stopLabel,
        stopPointPatch,
        stopWithRouteGraphData,
      ),
    ]);

    const mergedChanges = merge(
      {},
      defaultChanges,
      { conflicts },
      locationChanges,
    );

    return {
      ...mergedChanges,
      stopPointPatch: isEmpty(mergedChanges.stopPointPatch)
        ? null
        : mergedChanges.stopPointPatch,
      stopPlacePatch: quayPatchToStopPlacePatch(stopPlaceId, quayId, quayPatch),
      // the final state of the stop that will be after patching
      editedStop: merge(
        {},
        stopWithRouteGraphData,
        mergedChanges.stopPointPatch,
      ),
    };
  };
}

// default handler that can be used to show error messages as toast
// in case an exception is thrown
export function useDefaultErrorHandler() {
  const { t } = useTranslation();

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
      return showDangerToast(
        t('stops.timingPlaceRequired', { routeLabels: err.message }),
      );
    }

    if (err instanceof TiamatUpdateFailedError) {
      return showDangerToast(
        t('stops.tiamatUpdateFailed', { errorMessage: err.causeMessage }),
      );
    }

    if (err instanceof StopPointUpdateFailed) {
      return showDangerToast(
        t('stops.stopPointUpdateFailed', { errorMessage: err.causeMessage }),
      );
    }

    // if other error happened, show the generic error message
    return showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };
}

const refetchQueries = {
  awaitRefetchQueries: true,
  refetchQueries: () => ['getStopPlaceDetails', 'GetStopInfoForEditingOnMap'],
} as const;

export const useEditStop = () => {
  const [editStopMutation] = useEditStopMutation();
  const [editStopPlaceMutation] = useEditStopPlaceMutation();

  return async (changes: EditChanges) => {
    let updateStopPointResult: Awaited<
      ReturnType<typeof editStopMutation>
    > | null = null;
    let updateStopPlaceResult: Awaited<
      ReturnType<typeof editStopPlaceMutation>
    > | null = null;

    const updateStopPoint =
      !!changes.stopPointPatch ||
      !!changes.deleteStopFromJourneyPatternIds?.length;

    if (changes.stopPlacePatch) {
      updateStopPlaceResult = await wrapErrors(
        editStopPlaceMutation({
          variables: { patch: changes.stopPlacePatch },

          // If we are not going to update the StopPoint, refetch any and all
          // active map queries right away. Else defer to after StopPoint update.
          ...(!updateStopPoint ? refetchQueries : {}),
        }),
        TiamatUpdateFailedError,
        'Failed to update Stop Place in Tiamat!',
      );
    }

    if (updateStopPoint) {
      const variables = mapEditChangesToVariables(changes);
      updateStopPointResult = await wrapErrors(
        editStopMutation({
          variables,
          update(cache) {
            removeFromApolloCache(cache, {
              infrastructure_link_id:
                variables.stop_patch.located_on_infrastructure_link_id,
              __typename: 'infrastructure_network_infrastructure_link',
            });
          },

          // Always refetch map queries after StopPoint update.
          ...refetchQueries,
        }),
        StopPointUpdateFailed,
        'Failed to update Scheduled Stop Point in Lines & routes DB!',
      );
    }

    return { updateStopPointResult, updateStopPlaceResult };
  };
};
