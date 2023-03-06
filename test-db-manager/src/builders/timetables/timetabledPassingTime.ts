import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
} from '../../types';
import {
  buildPassingTimeSequence,
  buildTimeSequence,
  TimeSequenceParams,
} from './timeSequence';

/** Parameters for building a single timetabled passing time instance */
export type TimetabledPassingTimeInstanceBuilder = RequiredKeysOnly<
  TimetabledPassingTimeInsertInput,
  'arrival_time' | 'departure_time'
>;

/**
 * Builds a single timetabled passing time instance
 * @param vehicleJourneyId the vehicle journey this timetables passing time belongs to
 * @param stopInJpRefId ID for the stop in journey pattern to which the generated timetables passing times refer to
 * @param tptBase optional attributes for the timetables passing times
 * @return a timetables passing time instance
 * */
export const buildTimetabledPassingTimeInstance = (
  vehicleJourneyId: UUID,
  stopInJpRefId: UUID,
  tptBase: TimetabledPassingTimeInstanceBuilder,
): TimetabledPassingTimeInsertInput => ({
  timetabled_passing_time_id: uuid(),
  ...tptBase,
  vehicle_journey_id: vehicleJourneyId,
  scheduled_stop_point_in_journey_pattern_ref_id: stopInJpRefId,
});

/**
 * Parameters for building a sequence of timetabled passing times
 */
export type TimetabledPassingTimeSequenceBuilder = {
  /**
   * Default attributes for every timetables passing time object in the sequence
   */
  tptBase: PartialKeys<
    TimetabledPassingTimeInstanceBuilder,
    'arrival_time' | 'departure_time'
  >;
  /**
   * Time sequence building parameters (e.g. regular/random time interval between stops)
   */
  tptSequenceBuilder: TimeSequenceParams;
  /**
   * Departure time for the first timetabled passing time in the sequence
   */
  startTime: Duration;
  /**
   * Stops for which the timetables passing times are created
   */
  stops: StopInJourneyPatternRefInsertInput[];
  /**
   * List of Hastus stops (e.g. for knowing at which stop should be arrival time differ from the departure time)
   */
  hastusStopLabels: string[];
};

export const defaultTptSeqParams: Pick<
  TimetabledPassingTimeSequenceBuilder,
  'tptBase' | 'tptSequenceBuilder'
> = {
  tptBase: {},
  tptSequenceBuilder: {
    minTime: Duration.fromISO('PT1M'),
    maxTime: Duration.fromISO('PT8M'),
  },
};

/** Builds a sequence of timetables passing times
 * @param vehicleJourneyId the vehicle journey the generated timetables passing times will belong to
 */
export const buildTimetabledPassingTimeSequence = (
  vehicleJourneyId: UUID,
  {
    tptBase,
    tptSequenceBuilder,
    startTime,
    stops,
    hastusStopLabels,
  }: TimetabledPassingTimeSequenceBuilder,
): TimetabledPassingTimeInsertInput[] => {
  const timeSequence = buildTimeSequence(
    startTime,
    stops.length,
    tptSequenceBuilder,
  );
  const passingTimeSequence = buildPassingTimeSequence(timeSequence);

  return stops.map((stop, index) => {
    const passingTime = passingTimeSequence[index];
    // for hastus stops, add a 1 minute difference between arrival and departure times
    if (
      hastusStopLabels.includes(stop.scheduled_stop_point_label) &&
      passingTime.arrival_time &&
      passingTime.departure_time
    ) {
      passingTime.departure_time = passingTime.arrival_time.plus(
        Duration.fromISO('PT1M'),
      );
    }

    const tptDefaultAttributes = {
      ...tptBase,
      ...passingTime,
    };
    return buildTimetabledPassingTimeInstance(
      vehicleJourneyId,
      stop.scheduled_stop_point_in_journey_pattern_ref_id,
      tptDefaultAttributes,
    );
  });
};
