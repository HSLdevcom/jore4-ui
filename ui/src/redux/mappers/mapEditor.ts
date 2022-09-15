import {
  JourneyPatternStopFragment,
  RouteStopFieldsFragment,
  StopWithJourneyPatternFieldsFragment,
} from '../../generated/graphql';
import { filterDistinctConsecutiveStops } from '../../hooks/routes/useExtractRouteFromFeature';
import { StoreType } from './storeType';

/**
 * Maps a stop to a stop in journey pattern that can be used when
 * creating/updating route's journey pattern in GraphQL
 * @param label Stop label
 * @param stopInJourneyPattern Metadata of a stop on the journey pattern (e.g. via info)
 * @param index Stop's index on journey pattern
 * @returns Stop in journey pattern
 */
const mapStopToStopInSequence = (
  label: string,
  stopInJourneyPattern: JourneyPatternStopFragment | undefined,
  index: number,
) => {
  return {
    is_timing_point: stopInJourneyPattern?.is_timing_point || false,
    is_via_point: stopInJourneyPattern?.is_via_point || false,
    via_point_name_i18n: stopInJourneyPattern?.via_point_name_i18n,
    via_point_short_name_i18n: stopInJourneyPattern?.via_point_short_name_i18n,
    scheduled_stop_point_label: label,
    scheduled_stop_point_sequence: index,
  };
};

/**
 * Maps an array of stops to a list of stops in journey pattern,
 * can be used when creating/updating route's journey pattern in GraphQL
 * @param stopsEligibleForJourneyPattern Stops along route's geometry
 * @param includedStopLabels Stops that are included in the journey pattern
 * @param journeyPatternStops Metadata of stops in journey pattern (e.g. via info)
 * @returns Sequence of stops that belong to route's journey pattern
 */
export const buildStopSequence = ({
  stopsEligibleForJourneyPattern,
  includedStopLabels,
  journeyPatternStops,
}: {
  stopsEligibleForJourneyPattern: StoreType<RouteStopFieldsFragment>[];
  includedStopLabels: string[];
  journeyPatternStops: JourneyPatternStopFragment[];
}) => {
  const stops = filterDistinctConsecutiveStops(stopsEligibleForJourneyPattern);
  return {
    data: stops
      .filter((stop) => includedStopLabels.includes(stop.label))
      .map((routeStop, index) => {
        const { label } = routeStop;
        const stopInJourneyPattern = journeyPatternStops.find(
          (stop) => stop.scheduled_stop_point_label === label,
        );

        return mapStopToStopInSequence(label, stopInJourneyPattern, index);
      }),
  };
};

/**
 * Gets stop in journey pattern -metadata (e.g. via info) from stop.
 * @param stops Array of stops to map
 * @param routeId Route to whom related journey pattern metadata to get
 * @returns An array of stop in journey pattern -metadata
 */
export const mapRouteStopsToJourneyPatternStops = (
  stops: StopWithJourneyPatternFieldsFragment[],
  routeId: UUID,
) => {
  return stops.flatMap((stop) => {
    const journeyPatternStop =
      stop.scheduled_stop_point_in_journey_patterns?.find(
        (stopInRoute) => stopInRoute.journey_pattern.on_route_id === routeId,
      );

    return journeyPatternStop ? [journeyPatternStop] : [];
  });
};
