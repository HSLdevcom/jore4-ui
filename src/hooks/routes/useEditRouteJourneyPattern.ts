import {
  RouteRoute,
  UpdateRouteJourneyPatternMutationVariables,
  useDeleteStopFromJourneyPatternMutation,
  useUpdateRouteJourneyPatternMutation,
} from '../../generated/graphql';
import {
  getStopsAlongRouteGeometry,
  stopBelongsToJourneyPattern,
} from '../../graphql';
import { RouteStop } from '../../redux';
import { mapToVariables, removeFromApolloCache } from '../../utils';
import { useExtractRouteFromFeature } from '../useExtractRouteFromFeature';
import { mapStopsToScheduledStopPoints } from './useCreateRoute';

interface DeleteStopFromJourneyPatternParams {
  routeId: UUID;
  stopPointId: UUID;
}

/**
 * Hook for adding and removing single stops to route's journey pattern.
 */
export const useEditRouteJourneyPattern = () => {
  const [updateRouteJourneyPatternMutation] =
    useUpdateRouteJourneyPatternMutation();
  const [deleteStopFromJourneyPatternMutation] =
    useDeleteStopFromJourneyPatternMutation();

  const { mapRouteStopsToStopIds } = useExtractRouteFromFeature();

  const mapStopIdsToUpdateMutationVariables = (
    stopsIds: UUID[],
    routeId: UUID,
  ) => {
    const variables: UpdateRouteJourneyPatternMutationVariables = {
      route_id: routeId,
      new_journey_pattern: {
        on_route_id: routeId,
        scheduled_stop_point_in_journey_patterns:
          mapStopsToScheduledStopPoints(stopsIds),
      },
    };

    return mapToVariables(variables);
  };

  const addStopToRouteJourneyPattern = async (
    stopPointId: UUID,
    route: RouteRoute,
  ) => {
    const stopsAlongRoute = getStopsAlongRouteGeometry(route);

    const routeStops: RouteStop[] = stopsAlongRoute.map((stop) => ({
      id: stop.scheduled_stop_point_id,
      belongsToRoute: stopBelongsToJourneyPattern(stop, route.route_id),
    }));

    const newRouteStops = routeStops.map((item) =>
      item.id === stopPointId ? { ...item, belongsToRoute: true } : item,
    );

    const stopIdsWithinRoute = mapRouteStopsToStopIds(newRouteStops);

    const variables = mapStopIdsToUpdateMutationVariables(
      stopIdsWithinRoute,
      route.route_id,
    );

    await updateRouteJourneyPatternMutation({
      ...variables,
      // remove scheduled stop point from cache after mutation
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: stopPointId,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });
  };

  const deleteStopFromJourneyPattern = async ({
    routeId,
    stopPointId,
  }: DeleteStopFromJourneyPatternParams) => {
    await deleteStopFromJourneyPatternMutation({
      ...mapToVariables({
        route_id: routeId,
        scheduled_stop_point_id: stopPointId,
      }),
      // remove scheduled stop point from cache after mutation
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: stopPointId,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });
  };

  return {
    deleteStopFromJourneyPattern,
    addStopToRouteJourneyPattern,
  };
};
