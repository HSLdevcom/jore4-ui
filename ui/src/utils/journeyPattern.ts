import {
  JourneyPatternStopFragment,
  RouteStopFieldsFragment,
  StopWithJourneyPatternFieldsFragment,
} from '../generated/graphql';

/**
 * Removes all duplicate labeled consecutive stops from the list
 * This is used for example removing different versions of stops from the
 * journey pattern list where only the labels are shown
 */
export const filterDistinctConsecutiveStops = <TStop extends { label: string }>(
  stops: TStop[],
) => stops.filter((stop, index) => stops[index - 1]?.label !== stop.label);

export interface BuildJourneyPatternStopSequenceProps {
  stopsEligibleForJourneyPattern: RouteStopFieldsFragment[];
  includedStopLabels: string[];
  journeyPatternStops: JourneyPatternStopFragment[];
}

/**
 * Maps an array of stops to a list of stops in journey pattern,
 * can be used when creating/updating route's journey pattern in GraphQL
 * @param stopsEligibleForJourneyPattern Stops along route's geometry
 * @param includedStopLabels Stops that are included in the journey pattern
 * @param journeyPatternStops Metadata of stops in journey pattern (e.g. via info)
 * @returns Sequence of stops that belong to route's journey pattern
 */
export const buildJourneyPatternStopSequence = ({
  stopsEligibleForJourneyPattern,
  includedStopLabels,
  journeyPatternStops,
}: BuildJourneyPatternStopSequenceProps) => {
  const stops = filterDistinctConsecutiveStops(stopsEligibleForJourneyPattern);
  return {
    data: stops
      .filter((stop) => includedStopLabels.includes(stop.label))
      .map((routeStop, index) => {
        const { label } = routeStop;
        const stopInJourneyPattern = journeyPatternStops.find(
          (stop) => stop.scheduled_stop_point_label === label,
        );

        return {
          ...stopInJourneyPattern,
          scheduled_stop_point_label: label,
          scheduled_stop_point_sequence: index,
        };
      }),
  };
};

/**
 * Pick only desired fields from stop in journey pattern object
 */
export const mapStopInJourneyPatternToJourneyPatternStop = <
  TStop extends JourneyPatternStopFragment,
>(
  stopInJourneyPattern: TStop,
): JourneyPatternStopFragment => ({
  is_timing_point: stopInJourneyPattern?.is_timing_point || false,
  is_via_point: stopInJourneyPattern?.is_via_point || false,
  via_point_name_i18n: stopInJourneyPattern?.via_point_name_i18n,
  via_point_short_name_i18n: stopInJourneyPattern?.via_point_short_name_i18n,
  scheduled_stop_point_label: stopInJourneyPattern.scheduled_stop_point_label,
  scheduled_stop_point_sequence:
    stopInJourneyPattern.scheduled_stop_point_sequence,
});

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
    const stopInJourneyPattern =
      stop.scheduled_stop_point_in_journey_patterns?.find(
        (stopInRoute) => stopInRoute.journey_pattern.on_route_id === routeId,
      );

    return stopInJourneyPattern
      ? [mapStopInJourneyPatternToJourneyPatternStop(stopInJourneyPattern)]
      : [];
  });
};
