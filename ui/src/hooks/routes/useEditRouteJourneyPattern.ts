import { gql } from '@apollo/client';
import { pipe } from 'remeda';
import {
  JourneyPatternStopFragment,
  RouteStopFieldsFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  RouteWithInfrastructureLinksWithStopsFragment,
  UpdateRouteJourneyPatternMutationVariables,
  useUpdateRouteJourneyPatternMutation,
} from '../../generated/graphql';
import {
  mapInfrastructureLinksAlongRouteToRouteInfraLinks,
  stopBelongsToJourneyPattern,
} from '../../graphql';
import {
  addOrRemoveStopLabelsFromIncludedStops,
  buildJourneyPatternStopSequence,
  filterDistinctConsecutiveStops,
  mapRouteStopsToJourneyPatternStops,
  removeFromApolloCache,
} from '../../utils';
import { extractJourneyPatternCandidateStops } from './useExtractRouteFromFeature';
import { useValidateRoute } from './useValidateRoute';

const GQL_UPDATE_ROUTE_JOURNEY_PATTERN = gql`
  mutation UpdateRouteJourneyPattern(
    $journey_pattern_id: uuid!
    $new_stops_in_journey_pattern: [journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input!]!
  ) {
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: { journey_pattern_id: { _eq: $journey_pattern_id } }
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }

    insert_journey_pattern_scheduled_stop_point_in_journey_pattern(
      objects: $new_stops_in_journey_pattern
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }
  }
`;
interface DeleteStopParams {
  route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  stopPointLabels: ReadonlyArray<string>;
}

type AddStopParams = DeleteStopParams;

interface UpdateJourneyPatternChanges {
  journeyPatternId: UUID;
  stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  includedStopLabels: ReadonlyArray<string>;
  journeyPatternStops: ReadonlyArray<JourneyPatternStopFragment>;
}

export const getEligibleStopsAlongRoute = <
  TRoute extends RouteWithInfrastructureLinksWithStopsFragment,
>(
  route: TRoute,
) =>
  pipe(
    route,
    (routeGeometry) => routeGeometry.infrastructure_links_along_route,
    mapInfrastructureLinksAlongRouteToRouteInfraLinks,
    (links) => extractJourneyPatternCandidateStops(links, route),
  );

/**
 * Hook for adding and removing stops to route's journey pattern.
 */
export const useEditRouteJourneyPattern = () => {
  const [updateRouteJourneyPatternMutation] =
    useUpdateRouteJourneyPatternMutation();
  const { validateStopCount } = useValidateRoute();

  const prepareUpdateJourneyPattern = (
    params: AddStopParams | DeleteStopParams,
    stopBelongsToRoute: boolean,
  ) => {
    const { route, stopPointLabels } = params;

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
        addOrRemoveStopLabelsFromIncludedStops(
          stopLabels,
          stopPointLabels,
          stopBelongsToRoute,
        ),
    );

    validateStopCount(includedStopLabels);

    const journeyPatternStops = mapRouteStopsToJourneyPatternStops(
      stopsEligibleForJourneyPattern,
      route.route_id,
    );

    const changes: UpdateJourneyPatternChanges = {
      // In our data model route has always exactly one journey pattern
      journeyPatternId: route.route_journey_patterns[0].journey_pattern_id,
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
      journey_pattern_id: changes.journeyPatternId,
      new_stops_in_journey_pattern: buildJourneyPatternStopSequence(changes),
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
          journey_pattern_id: variables.journey_pattern_id,
          __typename: 'journey_pattern_journey_pattern',
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
