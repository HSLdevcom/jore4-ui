/* eslint-disable camelcase */
import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
} from '../../types';
import { buildRandomPassingTimeSequence, PassingTime } from '../common';

export type TimetabledPassingTimeBuildInput = RequiredKeysOnly<
  TimetabledPassingTimeInsertInput,
  | 'vehicle_journey_id'
  | 'arrival_time'
  | 'departure_time'
  | 'scheduled_stop_point_in_journey_pattern_ref_id'
>;
/**
 *  Builds a single timetables passing time instance from its attributes
 * */
export const buildTimetabledPassingTime = (
  passingTime: TimetabledPassingTimeBuildInput,
): TimetabledPassingTimeInsertInput => ({
  timetabled_passing_time_id: uuid(),
  ...passingTime,
});

/**
 * Build a sequence of timetabled passing times for a list of stops
 * @param passingTime optional attributes that are set for all timetabled passing times in the list
 * @param timeSequence a list of departure/arrival times within the sequence
 * @param stops a list of stops to create the timetabled passing times for
 * @returns list of timetables passing times
 */
export const buildTimetabledPassingTimeSequence = (
  passingTime: RequiredKeysOnly<
    TimetabledPassingTimeBuildInput,
    'vehicle_journey_id'
  >,
  passingTimeSequence: PassingTime[],
  stops: StopInJourneyPatternRefInsertInput[],
): TimetabledPassingTimeInsertInput[] => {
  if (passingTimeSequence.length !== stops.length) {
    throw new Error('Number of stops must equal the number of times');
  }

  return stops.map((stop, index) => {
    return buildTimetabledPassingTime({
      ...passingTime,
      ...passingTimeSequence[index],
      scheduled_stop_point_in_journey_pattern_ref_id:
        stop.scheduled_stop_point_in_journey_pattern_ref_id,
    });
  });
};

export const buildTimetabledPassingTimeSequenceForStops = (
  startTime: Duration,
  passingTime: RequiredKeysOnly<
    TimetabledPassingTimeBuildInput,
    'vehicle_journey_id'
  >,
  stops: StopInJourneyPatternRefInsertInput[],
): TimetabledPassingTimeInsertInput[] => {
  const passingTimeSequence = buildRandomPassingTimeSequence(
    startTime,
    stops.length,
  );
  return buildTimetabledPassingTimeSequence(
    passingTime,
    passingTimeSequence,
    stops,
  );
};
