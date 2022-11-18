import { RouteTableRowFragment } from '../generated/graphql';

/**
 * Checks if the route has any vehicle_journey's existing. If there is
 * that means that the route has timetables.
 */
export const routeHasTimetables = (
  route: Pick<RouteTableRowFragment, 'route_journey_patterns'>,
) =>
  route.route_journey_patterns.some((routeJourneyPattern) =>
    routeJourneyPattern.journey_pattern_refs.some(
      (journeyPatternRefs) => journeyPatternRefs.vehicle_journeys.length,
    ),
  );
