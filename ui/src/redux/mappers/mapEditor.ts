import { StopWithJourneyPatternFieldsFragment } from '../../generated/graphql';
import { RouteStop } from '../types';
import { mapToStoreType } from './storeType';

/**
 * Maps a RouteStop object to a stop in journey pattern that can be used when
 * creating/updating route's journey pattern in GraphQL
 * @param routeStop A stop along route's geometry
 * @param index Stop's index on journey pattern
 * @returns Stop in journey pattern
 */
const mapRouteStopToStopInSequence = (routeStop: RouteStop, index: number) => {
  const { stopInJourneyPattern } = routeStop;
  return {
    is_timing_point: stopInJourneyPattern?.is_timing_point || false,
    is_via_point: stopInJourneyPattern?.is_via_point || false,
    via_point_name_i18n: stopInJourneyPattern?.via_point_name_i18n,
    via_point_short_name_i18n: stopInJourneyPattern?.via_point_short_name_i18n,
    scheduled_stop_point_label: routeStop.stop.label,
    scheduled_stop_point_sequence: index,
  };
};

/**
 * Maps a list of RouteStop objects to a list of stops in journey pattern,
 * can be used when creating/updating route's journey pattern in GraphQL
 * @param stops Stops along route's geometry
 * @returns Sequence of stops that belong to route's journey pattern
 */
export const buildStopSequenceFromRouteStops = (stops: RouteStop[]) => {
  return {
    data: stops
      .filter((routeStop) => routeStop.belongsToJourneyPattern)
      .map(mapRouteStopToStopInSequence),
  };
};

/**
 * Maps a ServicePatternScheduledStopPoint to RouteStop.
 * Gets metadata related to stop in journey pattern from the stop object.
 * @param stop Stop to be mapped
 * @param belongsToJourneyPattern Does the stop belong to the route's journey pattern
 * @param routeId Id of the route in relation to which this stop is being handled
 * @returns RouteStop
 */
export const buildRouteStop = <
  TStop extends StopWithJourneyPatternFieldsFragment,
>(
  stop: TStop,
  belongsToJourneyPattern: boolean,
  routeId?: UUID,
): RouteStop => {
  const stopInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns?.find(
      (stopInRoute) => stopInRoute.journey_pattern.on_route_id === routeId,
    );

  return {
    belongsToJourneyPattern,
    stopInJourneyPattern,
    stop: mapToStoreType(stop),
  };
};
