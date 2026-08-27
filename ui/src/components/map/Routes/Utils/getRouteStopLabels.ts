import { RouteWithJourneyPatternStopsFragment } from '../../../../generated/graphql';

export function getRouteStopLabels(
  route: RouteWithJourneyPatternStopsFragment,
) {
  return route.route_journey_patterns[0].ordered_scheduled_stop_point_in_journey_patterns.map(
    (point) => point.scheduled_stop_point_label,
  );
}
