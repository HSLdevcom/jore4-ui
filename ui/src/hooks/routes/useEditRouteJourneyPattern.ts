import { pipe } from 'remeda';
import {
  JourneyPatternStopFragment,
  RouteRoute,
  RouteStopFieldsFragment,
  UpdateRouteJourneyPatternMutationVariables,
  useUpdateRouteJourneyPatternMutation,
} from '../../generated/graphql';
import {
  mapInfrastructureLinksAlongRouteToRouteInfraLinks,
  stopBelongsToJourneyPattern,
} from '../../graphql';
import { StoreType } from '../../redux';
import {
  addOrRemoveStopLabelFromIncludedStops,
  buildJourneyPatternStopSequence,
  filterDistinctConsecutiveStops,
  mapRouteStopsToJourneyPatternStops,
  removeFromApolloCache,
} from '../../utils';
import { extractJourneyPatternCandidateStops } from './useExtractRouteFromFeature';
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

export const getEligibleStopsAlongRoute = (route: RouteRoute) =>
  pipe(
    route,
    (routeGeometry) => routeGeometry.infrastructure_links_along_route,
    mapInfrastructureLinksAlongRouteToRouteInfraLinks,
    (links) => extractJourneyPatternCandidateStops(links, route),
  );

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

    // TODO: Get rid of stopsEligibleForJourneyPattern in this hook
    const stopsEligibleForJourneyPattern = pipe(
      route,
      getEligibleStopsAlongRoute,
      // If multiple versions of one stop is active, they are in the list, but
      // only one version should be added to the journey pattern
      filterDistinctConsecutiveStops,
    );

    const includedStopLabels = pipe(
      stopsEligibleForJourneyPattern,
      // Filter out stops that do not belong to journey pattern and map stops to labels
      (stops) =>
        stops
          .filter((stop) => stopBelongsToJourneyPattern(stop, route.route_id))
          .map((stop) => stop.label),
      // Add or remove stop from label list
      (stopLabels) =>
        addOrRemoveStopLabelFromIncludedStops(
          stopLabels,
          stopPointLabel,
          stopBelongsToRoute,
        ),
    );

    validateStopCount(includedStopLabels);

    const journeyPatternStops = mapRouteStopsToJourneyPatternStops(
      stopsEligibleForJourneyPattern,
      route.route_id,
    );

    const changes: UpdateJourneyPatternChanges = {
      routeId: route.route_id,
      stopsEligibleForJourneyPattern,
      includedStopLabels,
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
        scheduled_stop_point_in_journey_patterns:
          buildJourneyPatternStopSequence(changes),
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
