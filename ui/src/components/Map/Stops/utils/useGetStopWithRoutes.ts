import { useApolloClient } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';
import {
  GetStopWithRouteGraphDataByIdDocument,
  GetStopWithRouteGraphDataByIdQuery,
  GetStopWithRouteGraphDataByIdQueryVariables,
  JourneyPatternJourneyPattern,
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
} from '../../../../generated/graphql';
import { InternalError, illegalOptionalCast } from '../../../../utils';

// gets the unique list of parent routes for the input journey patterns
function getRoutesOfJourneyPatterns(
  journeyPatterns: ReadonlyArray<JourneyPatternJourneyPattern>,
) {
  const allRoutes = journeyPatterns
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => item.journey_pattern_route!);

  // in the future, multiple journey patterns may have the same route,
  // so let's make sure we only return unique results
  return uniqBy(allRoutes, (route) => route.route_id);
}

export type StopWithRoutes = {
  readonly stop: ServicePatternScheduledStopPoint;
  readonly routes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

export function useGetStopWithRoutes() {
  const apollo = useApolloClient();

  return async (stopId: UUID): Promise<StopWithRoutes> => {
    const stopWithRoutesResult = await apollo.query<
      GetStopWithRouteGraphDataByIdQuery,
      GetStopWithRouteGraphDataByIdQueryVariables
    >({
      query: GetStopWithRouteGraphDataByIdDocument,
      variables: { stopId },
    });
    const stopWithRouteGraphData =
      illegalOptionalCast<ServicePatternScheduledStopPoint>(
        stopWithRoutesResult.data.service_pattern_scheduled_stop_point.at(0),
      );

    if (!stopWithRouteGraphData) {
      throw new InternalError(
        `Could not find Scheduled Stop Point with id ${stopId}`,
      );
    }

    const journeyPatterns =
      stopWithRouteGraphData.scheduled_stop_point_in_journey_patterns.map(
        (item) => item.journey_pattern,
      );

    return {
      stop: stopWithRouteGraphData,
      routes: getRoutesOfJourneyPatterns(journeyPatterns),
    };
  };
}
