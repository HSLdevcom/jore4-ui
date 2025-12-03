import { Duration } from 'luxon';
import {
  PartialKeys,
  RequiredKeysOnly,
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
} from '../../types';
import { expectValue } from '../../utils';
import {
  TimeSequenceParams,
  buildPassingTimeSequence,
  buildTimeSequence,
} from './timeSequence';

/** Parameters for building a single timetabled passing time instance */
export type TimetabledPassingTimeInstanceBuilder = RequiredKeysOnly<
  TimetabledPassingTimeInsertInput,
  'arrival_time' | 'departure_time'
>;

/**
 * Builds a single timetabled passing time instance
 * @param vehicleJourneyId the vehicle journey this timetabled passing time belongs to
 * @param stopInJourneyPatternRefId ID for the stop in journey pattern to which the generated timetabled passing time refer to
 * @param timetabledPassingTimeBase optional attributes for the timetabled passing time
 * @return a timetabled passing time instance
 * */
export const buildTimetabledPassingTimeInstance = (
  vehicleJourneyId: UUID,
  stopInJourneyPatternRefId: UUID,
  timetabledPassingTimeBase: TimetabledPassingTimeInstanceBuilder,
): TimetabledPassingTimeInsertInput => ({
  timetabled_passing_time_id: crypto.randomUUID(),
  ...timetabledPassingTimeBase,
  vehicle_journey_id: vehicleJourneyId,
  scheduled_stop_point_in_journey_pattern_ref_id: stopInJourneyPatternRefId,
});

/**
 * Parameters for building a sequence of timetabled passing times
 */
export type TimetabledPassingTimeSequenceBuilder = {
  /** Default attributes for every timetabled passing time object in the sequence */
  timetabledPassingTimeBase: PartialKeys<
    TimetabledPassingTimeInstanceBuilder,
    'arrival_time' | 'departure_time'
  >;
  /** Time sequence building parameters (e.g. regular/random time interval between stops) */
  timetabledPassingTimeSequenceBuilder: TimeSequenceParams;
  /** Departure time for the first timetabled passing time in the sequence */
  startTime: Duration;
  /** Stops for which the timetabled passing times are created */
  stops: StopInJourneyPatternRefInsertInput[];
  /** List of Hastus stops (e.g. for knowing at which stop should be arrival time differ from the departure time) */
  hastusStopLabels: string[];
};

export const defaultTimetabledPassingTimeParams = {
  timetabledPassingTimeBase: {},
  timetabledPassingTimeSequenceBuilder: {
    minTime: Duration.fromISO('PT1M'),
    maxTime: Duration.fromISO('PT8M'),
  },
} satisfies Partial<TimetabledPassingTimeSequenceBuilder>;

/** Builds a sequence of timetabled passing times
 * @param vehicleJourneyId the vehicle journey the generated timetabled passing times will belong to
 */
export const buildTimetabledPassingTimeSequence = (
  vehicleJourneyId: UUID,
  {
    timetabledPassingTimeBase,
    timetabledPassingTimeSequenceBuilder,
    startTime,
    stops,
    hastusStopLabels,
  }: TimetabledPassingTimeSequenceBuilder,
): TimetabledPassingTimeInsertInput[] => {
  // we cannot generate a valid sequence with less than 2 stops
  if (stops.length < 2) {
    return [];
  }

  const timeSequence = buildTimeSequence(
    startTime,
    stops.length,
    timetabledPassingTimeSequenceBuilder,
  );
  const passingTimeSequence = buildPassingTimeSequence(timeSequence);

  return stops.map((stop, index) => {
    const passingTime = passingTimeSequence[index];
    // for hastus stops, add a 1 minute difference between arrival and departure times
    if (
      hastusStopLabels.includes(stop.scheduled_stop_point_label as string) &&
      passingTime.arrival_time &&
      passingTime.departure_time
    ) {
      passingTime.departure_time = passingTime.arrival_time.plus(
        Duration.fromISO('PT1M'),
      );
    }

    const tptDefaultAttributes = {
      ...timetabledPassingTimeBase,
      ...passingTime,
    };
    return buildTimetabledPassingTimeInstance(
      vehicleJourneyId,
      expectValue(stop.scheduled_stop_point_in_journey_pattern_ref_id),
      tptDefaultAttributes,
    );
  });
};
