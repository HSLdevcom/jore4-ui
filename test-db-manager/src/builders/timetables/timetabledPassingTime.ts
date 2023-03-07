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
  'arrival_time' | 'departure_time'
>;
/**
 * Builds a single timetables passing time
 * @param vehicleJourneyId the vehicle journey this timetables passing time belongs to
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

export type TimetabledPassingTimeSequenceBuilder = {
  tptBase: PartialKeys<
    TimetabledPassingTimeInstanceBuilder,
    'arrival_time' | 'departure_time'
  >;
  tptSequenceBuilder: TimeSequenceParams;
  startTime: Duration;
  stops: StopInJourneyPatternRefInsertInput[];
};

export const defaultTptSeqParams: Pick<
  TimetabledPassingTimeSequenceBuilder,
  'tptBase' | 'tptSequenceBuilder'
> = {
  tptBase: {},
  tptSequenceBuilder: {
    minTime: Duration.fromISO('PT0M'),
    maxTime: Duration.fromISO('PT5M'),
  },
};

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
    buildTimetabledPassingTimeInstance(
      vehicleJourneyId,
      stop.scheduled_stop_point_in_journey_pattern_ref_id,
      {
        ...tptBase,
        ...passingTimeSequence[index],
      },
    ),
  );
};
