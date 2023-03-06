import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  JourneyPatternRefInsertInputDeep,
  JourneyType,
  VehicleJourneyInsertInput,
  VehicleJourneyInsertInputDeep,
} from '../../types';
import { buildRandomDuration } from '../common';
import { buildTimetabledPassingTimeSequenceForStops } from './timetabledPassingTime';

export type VehicleJourneyBuildInput = RequiredKeysOnly<
  VehicleJourneyInsertInput,
  'block_id' | 'journey_pattern_ref_id'
>;
export const buildVehicleJourney = (
  vjBase: VehicleJourneyBuildInput,
): VehicleJourneyInsertInput => ({
  vehicle_journey_id: uuid(),
  journey_type: JourneyType.Standard,
  is_backup_journey: false,
  is_extra_journey: false,
  is_vehicle_type_mandatory: false,
  ...vjBase,
});

export const buildVehicleJourneyWithPassingTimes = (
  startTime: Duration,
  vjBase: RequiredKeysOnly<VehicleJourneyBuildInput, 'block_id'>,
  jp: JourneyPatternRefInsertInputDeep,
): VehicleJourneyInsertInputDeep => {
  // build the main vehicle journey entity
  const vehicleJourney = buildVehicleJourney({
    ...vjBase,
    journey_pattern_ref_id: jp.journey_pattern_ref_id,
  });

  // build the timetables passing times based on the journey pattern stops
  const stops = jp.scheduled_stop_point_in_journey_pattern_refs.data;
  const timetabledPassingTimes = buildTimetabledPassingTimeSequenceForStops(
    startTime,
    { vehicle_journey_id: vehicleJourney.vehicle_journey_id },
    stops,
  );

  return {
    ...vehicleJourney,
    timetabled_passing_times: { data: timetabledPassingTimes },
  };
};

export const getVehicleJourneyTimes = (vj: VehicleJourneyInsertInputDeep) => {
  const passingTimes = vj.timetabled_passing_times.data;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const start = passingTimes[0].departure_time!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const end = passingTimes[passingTimes.length - 1].arrival_time!;
  const duration = end.minus(start);

  return { start, end, duration };
};

export const buildVehicleJourneySequenceWithPassingTimes = (
  sequenceStartTime: Duration,
  vjBase: RequiredKeysOnly<VehicleJourneyBuildInput, 'block_id'>,
  journeyPatterns: JourneyPatternRefInsertInputDeep[],
  count: number,
): VehicleJourneyInsertInputDeep[] => {
  const vehicleJourneys: VehicleJourneyInsertInputDeep[] = [];
  let startTime = sequenceStartTime;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    const jp = journeyPatterns[i % journeyPatterns.length];
    const vj = buildVehicleJourneyWithPassingTimes(startTime, vjBase, jp);
    vehicleJourneys.push(vj);
    const vjTimes = getVehicleJourneyTimes(vj);
    const waitBetween = buildRandomDuration();
    startTime = startTime.plus(vjTimes.duration).plus(waitBetween);
  }
  return vehicleJourneys;
};
