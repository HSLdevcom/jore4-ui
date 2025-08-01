import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import {
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  JourneyPatternStopFragment,
  RouteStopFieldsFragment,
  StopWithJourneyPatternFieldsFragment,
} from '../generated/graphql';

export const stopInJourneyPatternFieldsToRemove = {
  __typename: undefined,
  journey_pattern: undefined,
  journey_pattern_id: undefined,
  scheduled_stop_points: undefined,
};

/**
 * Removes all duplicate labeled consecutive stops from the list
 * This is used for example removing different versions of stops from the
 * journey pattern list where only the labels are shown
 */
export const filterDistinctConsecutiveStops = <TStop extends { label: string }>(
  stops: ReadonlyArray<TStop>,
) => stops.filter((stop, index) => stops[index - 1]?.label !== stop.label);

type BuildJourneyPatternStopSequenceProps = {
  readonly stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  readonly includedStopLabels: ReadonlyArray<string>;
  readonly journeyPatternStops: ReadonlyArray<JourneyPatternStopFragment>;
  readonly journeyPatternId?: UUID;
};

/**
 * Maps an array of stops to a list of stops in journey pattern,
 * can be used when creating/updating route's journey pattern in GraphQL
 * @param stopsEligibleForJourneyPattern Stops along route's geometry
 * @param includedStopLabels Stops that are included in the journey pattern
 * @param journeyPatternStops Metadata of stops in journey pattern (e.g. via info)
 * @param journeyPatternId Journey pattern id
 * @returns Sequence of stops that belong to route's journey pattern
 */
export const buildJourneyPatternStopSequence = ({
  stopsEligibleForJourneyPattern,
  includedStopLabels,
  journeyPatternStops,
  journeyPatternId,
}: BuildJourneyPatternStopSequenceProps): JourneyPatternScheduledStopPointInJourneyPatternInsertInput[] => {
  const stops = filterDistinctConsecutiveStops(stopsEligibleForJourneyPattern);
  return stops
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
        ...(journeyPatternId && {
          journey_pattern_id: journeyPatternId,
        }),
      };
    });
};

/**
 * Gets stop in journey pattern -metadata (e.g. via info) from stop.
 * @param stops Array of stops to map
 * @param routeId Route to whom related journey pattern metadata to get
 * @returns An array of stop in journey pattern -metadata
 */
export const mapRouteStopsToJourneyPatternStops = (
  stops: ReadonlyArray<StopWithJourneyPatternFieldsFragment>,
  routeId: UUID,
) => {
  return stops.flatMap((stop) => {
    const stopInJourneyPattern =
      stop.scheduled_stop_point_in_journey_patterns?.find(
        (stopInRoute) => stopInRoute.journey_pattern.on_route_id === routeId,
      );

    return stopInJourneyPattern
      ? [
          {
            ...stopInJourneyPattern,
            // Remove extra fields
            ...stopInJourneyPatternFieldsToRemove,
          },
        ]
      : [];
  });
};

type JourneyPatternWithGenericReturnType<TType> = {
  scheduled_stop_point_in_journey_patterns: ReadonlyArray<
    TType & {
      scheduled_stop_point_sequence: number;
    }
  >;
};

/**
 * Extracts the first stop of journey pattern with the given TType typing
 */
export const extractJourneyPatternFirstStop = <TType>(
  journeyPattern: JourneyPatternWithGenericReturnType<TType>,
) => {
  return minBy(
    journeyPattern.scheduled_stop_point_in_journey_patterns,
    'scheduled_stop_point_sequence',
  );
};

/**
 * Extracts the last stop of journey pattern with the given TType typing
 */
export const extractJourneyPatternLastStop = <TType>(
  journeyPattern: JourneyPatternWithGenericReturnType<TType>,
) => {
  return maxBy(
    journeyPattern.scheduled_stop_point_in_journey_patterns,
    'scheduled_stop_point_sequence',
  );
};
