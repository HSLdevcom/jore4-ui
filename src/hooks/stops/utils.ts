import uniqBy from 'lodash/uniqBy';
import {
  JourneyPatternJourneyPattern,
  ServicePatternScheduledStopPoint,
} from '../../generated/graphql';

// checking whether this stop is the start or end stop of an existing route
export const isStartingOrEndingStopOfAnyRoute = (
  stopWithRouteGraphData: ServicePatternScheduledStopPoint,
) => {
  const stopId = stopWithRouteGraphData.scheduled_stop_point_id;
  return stopWithRouteGraphData.scheduled_stop_point_in_journey_patterns.some(
    (item) => {
      // journey patterns/routes that this stop is part of
      const route = item.journey_pattern.journey_pattern_route;
      // is the stop the start or end stop of this given route
      return (
        stopId === route?.starts_from_scheduled_stop_point_id ||
        stopId === route?.ends_at_scheduled_stop_point_id
      );
    },
  );
};

// gets the unique list of parent routes for the input journey patterns
export const getRoutesOfJourneyPatterns = (
  journeyPatterns: JourneyPatternJourneyPattern[],
) => {
  const allRoutes = journeyPatterns
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => item.journey_pattern_route!);

  // in the future, multiple journey patterns may have the same route,
  // so let's make sure we only return unique results
  return uniqBy(allRoutes, (route) => route.route_id);
};
