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

export type TimetabledPassingTimeInstanceBuilder = RequiredKeysOnly<
  TimetabledPassingTimeInsertInput,
  | 'arrival_time'
  | 'departure_time'
  | 'scheduled_stop_point_in_journey_pattern_ref_id'
>;
/**
 * Builds a single timetables passing time
 * @param vehicleJourneyId the vehicle journey this timetables passing time belongs to
 * @param tptBase optional attributes for the timetables passing times
 * @return a timetables passing time instance
 * */
export const buildTimetabledPassingTimeInstance = (
  vehicleJourneyId: UUID,
  tptBase: TimetabledPassingTimeInstanceBuilder,
): TimetabledPassingTimeInsertInput => ({
  timetabled_passing_time_id: uuid(),
  ...tptBase,
  vehicle_journey_id: vehicleJourneyId,
});

export type TimetabledPassingTimeSequenceBuilder = {
  tptBase: PartialKeys<
    TimetabledPassingTimeInstanceBuilder,
    'arrival_time' | 'departure_time'
  >;
  tptSequenceBuilder: TimeSequenceParams;
  startTime: Duration;
  stops: StopInJourneyPatternRefInsertInput[];
};
/**
 * Build a sequence of timetabled passing times for a list of stops
 * @param startTime when should the first passing time be
 * @param tptBase optional attributes that are set for all timetabled passing times in the list
 * @param stops a list of stops to create the timetabled passing times for
 * @returns list of timetables passing times
 */
export const buildTimetabledPassingTimeSequence = (
  vehicleJourneyId: UUID,
  {
    tptBase,
    tptSequenceBuilder,
    startTime,
    stops,
  }: TimetabledPassingTimeSequenceBuilder,
): TimetabledPassingTimeInsertInput[] => {
  const timeSequence = buildTimeSequence(
    startTime,
    stops.length,
    tptSequenceBuilder,
  );
  const passingTimeSequence = buildPassingTimeSequence(timeSequence);

  return stops.map((stop, index) =>
    buildTimetabledPassingTimeInstance(vehicleJourneyId, {
      ...tptBase,
      ...passingTimeSequence[index],
      scheduled_stop_point_in_journey_pattern_ref_id:
        stop.scheduled_stop_point_in_journey_pattern_ref_id,
    }),
  );
};
