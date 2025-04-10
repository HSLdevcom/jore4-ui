import { gql } from '@apollo/client';
import flow from 'lodash/flow';
import {
  InsertStopPointMutationVariables,
  ScheduledStopPointDefaultFieldsFragment,
  ServicePatternScheduledStopPointInsertInput,
  useInsertStopPointMutation,
  useUpdateScheduledStopPointStopPlaceRefMutation,
} from '../../generated/graphql';
import { StopWithLocation } from '../../graphql';
import { OptionalKeys } from '../../types';
import {
  IncompatibleWithExistingRoutesError,
  getRouteLabelVariantText,
  removeFromApolloCache,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import {
  BrokenRouteCheckParams,
  useGetRoutesBrokenByStopChange,
} from './useEditStop';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';

// the input does not need to contain all the fields
export type CreateInput = OptionalKeys<
  ServicePatternScheduledStopPointInsertInput,
  'direction' | 'located_on_infrastructure_link_id'
>;

interface CreateParams {
  input: CreateInput;
}
export interface CreateChanges {
  stopToCreate: ServicePatternScheduledStopPointInsertInput;
  conflicts?: ScheduledStopPointDefaultFieldsFragment[];
}

const GQL_INSERT_STOP_POINT = gql`
  mutation InsertStopPoint(
    $stopPoint: service_pattern_scheduled_stop_point_insert_input!
  ) {
    stopPoint: insert_service_pattern_scheduled_stop_point_one(
      object: $stopPoint
    ) {
      scheduled_stop_point_id
      located_on_infrastructure_link_id
      direction
      priority
      measured_location
      label
      validity_start
      validity_end
    }
  }
`;

// This update is needed in the creation process, where we first create
// the scheduled stop point, then we create the stop place and
// lastly we update the scheduled stop point stop place ref
// This all is probably going to change if we get some transaction service
const GQL_UPDATE_SCHEDULED_STOP_POINT_STOP_PLACE_REF = gql`
  mutation updateScheduledStopPointStopPlaceRef(
    $scheduled_stop_point_id: uuid!
    $stop_place_ref: String
  ) {
    update_service_pattern_scheduled_stop_point_by_pk(
      pk_columns: { scheduled_stop_point_id: $scheduled_stop_point_id }
      _set: { stop_place_ref: $stop_place_ref }
    ) {
      scheduled_stop_point_id
      stop_place_ref
    }
  }
`;

export const useCreateStop = () => {
  const [mutateFunction] = useInsertStopPointMutation();
  const [updateScheduledStopPointStopPlaceRefMutation] =
    useUpdateScheduledStopPointStopPlaceRefMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();
  const getRoutesBrokenByStopChange = useGetRoutesBrokenByStopChange();

  const insertStopMutation = async (
    variables: InsertStopPointMutationVariables,
  ) => {
    return mutateFunction({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          infrastructure_link_id:
            variables.stopPoint.located_on_infrastructure_link_id,
          __typename: 'infrastructure_network_infrastructure_link',
        });
      },
    });
  };

  // pre-fills and pre-validates a few fields for the draft stop
  // throws exceptions in case or error
  const createDraftStop = async (stopLocation: GeoJSON.Point) => {
    const draftStop: StopWithLocation = {
      measured_location: stopLocation,
    };

    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation,
    });
    draftStop.located_on_infrastructure_link_id =
      closestLink.infrastructure_link_id;
    draftStop.direction = direction;
    draftStop.timing_place_id = null;

    return draftStop;
  };

  // if added stop conflicts with existing routes, warn user.
  // for example, if a stop with same label has already been added to a route,
  // but new stop is not located on that route's geometry, the stop cannot be added
  const checkForBrokenRoutes = async (params: BrokenRouteCheckParams) => {
    const { brokenRoutes } = await getRoutesBrokenByStopChange(params);

    if (brokenRoutes?.length) {
      throw new IncompatibleWithExistingRoutesError(
        brokenRoutes.map((route) => getRouteLabelVariantText(route)).join(', '),
      );
    }
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareCreate = async ({ input }: CreateParams) => {
    const conflicts = await getConflictingStops({
      // these form values always exist
      label: input.label,
      priority: input.priority,
      validityStart: input.validity_start ?? undefined,
      validityEnd: input.validity_end ?? undefined,
    });
    // we need to fetch the infra link and direction for the stop
    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation: input.measured_location,
    });

    // check if any routes are broken if this stops is added
    await checkForBrokenRoutes({
      newLink: closestLink,
      newDirection: direction,
      newStop: input,
      label: input.label,
      priority: input.priority,
      stopId: null,
    });

    const stopToCreate: ServicePatternScheduledStopPointInsertInput = {
      ...input,
      located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
      direction,
    };

    const changes: CreateChanges = {
      stopToCreate,
      conflicts,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (changes: CreateChanges) => {
    const variables: InsertStopPointMutationVariables = {
      stopPoint: changes.stopToCreate,
    };
    return variables;
  };

  const prepareAndExecute = flow(
    prepareCreate,
    mapCreateChangesToVariables,
    insertStopMutation,
  );

  return {
    createDraftStop,
    prepareCreate,
    mapCreateChangesToVariables,
    insertStopMutation,
    updateScheduledStopPointStopPlaceRefMutation,
    prepareAndExecute,
  };
};
