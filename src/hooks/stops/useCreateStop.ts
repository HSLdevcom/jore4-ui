import flow from 'lodash/flow';
import {
  InsertStopMutationVariables,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointInsertInput,
  useGetRoutesBrokenByStopChangeAsyncQuery,
  useInsertStopMutation,
} from '../../generated/graphql';
import {
  mapGetRoutesBrokenByStopChangeResult,
  StopWithLocation,
} from '../../graphql';
import { OptionalKeys } from '../../types';
import { IncompatibleWithExistingRoutesError } from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
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
  conflicts?: ServicePatternScheduledStopPoint[];
}

export const useCreateStop = () => {
  const [insertStopMutation] = useInsertStopMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();
  const [getBrokenRoutes] = useGetRoutesBrokenByStopChangeAsyncQuery();

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

    return draftStop;
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

    // if added stop conflicts with existing routes, warn user.
    // for example, if a stop with same label has already been added to a route,
    // but new stop is not located on that route's geometry, the stop cannot be added
    const brokenRoutesResult = await getBrokenRoutes({
      new_located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
      new_direction: direction,
      new_label: input.label,
      new_validity_start: input.validity_start,
      new_validity_end: input.validity_end,
      replace_scheduled_stop_point_id: null,
    });

    const brokenRoutes =
      mapGetRoutesBrokenByStopChangeResult(brokenRoutesResult);

    if (brokenRoutes?.length) {
      throw new IncompatibleWithExistingRoutesError(
        brokenRoutes
          .map((route) => route.journey_pattern_route?.label)
          .join(', '),
      );
    }

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
