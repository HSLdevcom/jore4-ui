import flow from 'lodash/flow';
import {
  InsertStopMutationVariables,
  ScheduledStopPointDefaultFieldsFragment,
  ServicePatternScheduledStopPointInsertInput,
  useInsertStopMutation,
} from '../../generated/graphql';
import { StopWithLocation } from '../../graphql';
import { OptionalKeys } from '../../types';
import {
  IncompatibleWithExistingRoutesError,
  getRouteLabelVariantText,
  removeFromApolloCache,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { BrokenRouteCheckParams, useEditStop } from './useEditStop';
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

export const useCreateStop = () => {
  const [mutateFunction] = useInsertStopMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();
  const { getRoutesBrokenByStopChange } = useEditStop();

  const insertStopMutation = async (variables: InsertStopMutationVariables) => {
    return mutateFunction({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          infrastructure_link_id:
            variables.object.located_on_infrastructure_link_id,
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
      validityStart: input.validity_start || undefined,
      validityEnd: input.validity_end || undefined,
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
    const variables: InsertStopMutationVariables = {
      object: changes.stopToCreate,
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
    prepareAndExecute,
  };
};
