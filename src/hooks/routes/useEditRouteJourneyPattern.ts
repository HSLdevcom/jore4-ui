import {
  DeleteStopFromJourneyPatternMutationVariables,
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
import { removeFromApolloCache } from '../../utils';
import { useExtractRouteFromFeature } from '../useExtractRouteFromFeature';
import { mapStopsToStopSequence } from './useCreateRoute';

interface DeleteStopParams {
  routeId: UUID;
  stopPointLabel: UUID;
}

type DeleteStopChanges = DeleteStopParams;

interface AddStopParams {
  stopPointLabel: string;
  route: RouteRoute;
}

interface AddStopChanges {
  routeId: UUID;
  stopLabelsWithinRoute: UUID[];
}

/**
 * Hook for adding and removing single stops to route's journey pattern.
 */
export const useEditRouteJourneyPattern = () => {
  const [updateRouteJourneyPatternMutation] =
    useUpdateRouteJourneyPatternMutation();
  const [deleteStopFromJourneyPatternMutation] =
    useDeleteStopFromJourneyPatternMutation();

  const { mapRouteStopsToStopLabels } = useExtractRouteFromFeature();

  const prepareDeleteStopFromRoute = (params: DeleteStopParams) => {
    const changes: DeleteStopChanges = params;

    return changes;
  };

  const mapDeleteStopFromRouteChangesToVariables = (
    changes: DeleteStopChanges,
  ) => ({
    route_id: changes.routeId,
    scheduled_stop_point_label: changes.stopPointLabel,
  });

  const deleteStopFromRouteMutation = async (
    variables: DeleteStopFromJourneyPatternMutationVariables,
  ) => {
    await deleteStopFromJourneyPatternMutation({
      variables,
      // remove scheduled stop point from cache after mutation
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: variables.route_id,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });
  };

  const prepareAddStopToRoute = (params: AddStopParams) => {
    const { route, stopPointLabel } = params;

    const stopsAlongRoute = getStopsAlongRouteGeometry(route);

    const routeStops: RouteStop[] = stopsAlongRoute.map((stop) => ({
      label: stop.label,
      belongsToRoute: stopBelongsToJourneyPattern(stop, route.route_id),
    }));

    const newRouteStops = routeStops.map((item) =>
      item.label === stopPointLabel ? { ...item, belongsToRoute: true } : item,
    );

    const stopLabelsWithinRoute = mapRouteStopsToStopLabels(newRouteStops);

    const changes: AddStopChanges = {
      routeId: route.route_id,
      stopLabelsWithinRoute,
    };

    return changes;
  };

  const mapAddStopToRouteChangesToVariables = (changes: AddStopChanges) => {
    const variables: UpdateRouteJourneyPatternMutationVariables = {
      route_id: changes.routeId,
      new_journey_pattern: {
        on_route_id: changes.routeId,
        scheduled_stop_point_in_journey_patterns: mapStopsToStopSequence(
          changes.stopLabelsWithinRoute,
        ),
      },
    };

    return variables;
  };

  const addStopToRouteMutation = async (
    variables: UpdateRouteJourneyPatternMutationVariables,
  ) => {
    await updateRouteJourneyPatternMutation({
      variables,
      // remove scheduled stop point from cache after mutation
      update(cache) {
        removeFromApolloCache(cache, {
          route_id: variables.route_id,
          __typename: 'route_route',
        });
      },
    });
  };

  return {
    prepareDeleteStopFromRoute,
    mapDeleteStopFromRouteChangesToVariables,
    deleteStopFromRouteMutation,
    prepareAddStopToRoute,
    mapAddStopToRouteChangesToVariables,
    addStopToRouteMutation,
  };
};
