import {
  JourneyPatternStopFragment,
  RouteRoute,
  RouteStopFieldsFragment,
  UpdateRouteJourneyPatternMutationVariables,
  useUpdateRouteJourneyPatternMutation,
} from '../../generated/graphql';
import {
  getEligibleStopsAlongRouteGeometry,
  stopBelongsToJourneyPattern,
} from '../../graphql';
import {
  buildStopSequence,
  mapRouteStopsToJourneyPatternStops,
  StoreType,
} from '../../redux';
import { removeFromApolloCache } from '../../utils';
import { filterDistinctConsecutiveStops } from './useExtractRouteFromFeature';
import { useValidateRoute } from './useValidateRoute';

interface DeleteStopParams {
  route: RouteRoute;
  stopPointLabel: string;
}

type AddStopParams = DeleteStopParams;

interface UpdateJourneyPatternChanges {
  routeId: UUID;
  stopsEligibleForJourneyPattern: StoreType<RouteStopFieldsFragment>[];
  includedStopLabels: string[];
  journeyPatternStops: JourneyPatternStopFragment[];
}

/**
 * Hook for adding and removing single stops to route's journey pattern.
 */
export const useEditRouteJourneyPattern = () => {
  const [updateRouteJourneyPatternMutation] =
    useUpdateRouteJourneyPatternMutation();
  const { validateStopCount } = useValidateRoute();

  const prepareUpdateJourneyPattern = (
    params: AddStopParams | DeleteStopParams,
    stopBelongsToRoute: boolean,
  ) => {
    const { route, stopPointLabel } = params;
    const stopsAlongRoute = getEligibleStopsAlongRouteGeometry(route);

    const routeStops = stopsAlongRoute.filter((stop) => {
      const isStopToEdit = stopPointLabel === stop.label;

      const belongsToRoute = isStopToEdit
        ? stopBelongsToRoute
        : stopBelongsToJourneyPattern(stop, route.route_id);

      return belongsToRoute;
    });

    // If multiple versions of one stop is active, they are in the list, but
    // only one version should be added to the journey pattern
    const distinctConsecutiveRouteStops =
      filterDistinctConsecutiveStops(routeStops);

    validateStopCount(distinctConsecutiveRouteStops);

    const journeyPatternStops = mapRouteStopsToJourneyPatternStops(
      routeStops,
      route.route_id,
    );

    const changes: UpdateJourneyPatternChanges = {
      routeId: route.route_id,
      stopsEligibleForJourneyPattern: routeStops,
      includedStopLabels: distinctConsecutiveRouteStops.map(
        (stop) => stop.label,
      ),
      journeyPatternStops,
    };

    return changes;
  };

  const prepareDeleteStopFromRoute = (params: DeleteStopParams) => {
    return prepareUpdateJourneyPattern(params, false);
  };

  const mapEditJourneyPatternChangesToVariables = (
    changes: UpdateJourneyPatternChanges,
  ) => {
    const variables: UpdateRouteJourneyPatternMutationVariables = {
      route_id: changes.routeId,
      new_journey_pattern: {
        on_route_id: changes.routeId,
        scheduled_stop_point_in_journey_patterns: buildStopSequence(changes),
      },
    };

    return variables;
  };

  const prepareAddStopToRoute = (params: AddStopParams) => {
    return prepareUpdateJourneyPattern(params, true);
  };

  const updateRouteGeometryMutation = async (
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
    prepareAddStopToRoute,
    mapEditJourneyPatternChangesToVariables,
    updateRouteGeometryMutation,
  };
};
