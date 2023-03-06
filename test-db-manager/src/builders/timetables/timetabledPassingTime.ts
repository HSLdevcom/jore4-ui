import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
} from '../../types';
import { buildRandomPassingTimeSequence } from '../common';

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
  tptBase: TimetabledPassingTimeBuildInput,
): TimetabledPassingTimeInsertInput => ({
  timetabled_passing_time_id: uuid(),
  ...tptBase,
});

/**
 * Build a sequence of timetabled passing times for a list of stops
 * @param startTime when should the first passing time be
 * @param tptBase optional attributes that are set for all timetabled passing times in the list
 * @param stops a list of stops to create the timetabled passing times for
 * @returns list of timetables passing times
 */
export const buildTimetabledPassingTimeSequenceForStops = (
  startTime: Duration,
  tptBase: RequiredKeysOnly<
    TimetabledPassingTimeBuildInput,
    'vehicle_journey_id'
  >,
  stops: StopInJourneyPatternRefInsertInput[],
): TimetabledPassingTimeInsertInput[] => {
  const passingTimeSequence = buildRandomPassingTimeSequence(
    startTime,
    stops.length,
  );

  return stops.map((stop, index) =>
    buildTimetabledPassingTime({
      ...tptBase,
      ...passingTimeSequence[index],
      scheduled_stop_point_in_journey_pattern_ref_id:
        stop.scheduled_stop_point_in_journey_pattern_ref_id,
    }),
  );
};
