import { LineRouteSearchRouteWithJourneyPatternDetailsFragment } from '../../../../../generated/graphql';

/**
 * Checks if the route has any vehicle_journey's existing. If there is
 * that means that the route has timetables.
 */
export function routeHasTimetables(
  route: LineRouteSearchRouteWithJourneyPatternDetailsFragment,
) {
  return route.route_journey_patterns.some((routeJourneyPattern) =>
    routeJourneyPattern.journey_pattern_refs.some(
      (journeyPatternRefs) => journeyPatternRefs.vehicle_journeys.length,
    ),
  );
}
