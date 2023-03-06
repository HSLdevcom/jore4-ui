import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  JourneyPatternRefInsertInputDeep,
  JourneyType,
  VehicleJourneyInsertInput,
  VehicleJourneyInsertInputDeep,
} from '../../types';
import { buildTimetabledPassingTimeSequenceForStops } from './timetabledPassingTime';

export type VehicleJourneyBuildInput = RequiredKeysOnly<
  VehicleJourneyInsertInput,
  'block_id' | 'journey_pattern_ref_id'
>;
export const buildVehicleJourney = (
  vj: VehicleJourneyBuildInput,
): VehicleJourneyInsertInput => ({
  vehicle_journey_id: uuid(),
  journey_type: JourneyType.Standard,
  is_backup_journey: false,
  is_extra_journey: false,
  is_vehicle_type_mandatory: false,
  ...vj,
});

export const buildVehicleJourneyWithPassingTimes = (
  startTime: Duration,
  vj: VehicleJourneyBuildInput,
  jp: JourneyPatternRefInsertInputDeep,
): VehicleJourneyInsertInputDeep => {
  const vehicleJourney = buildVehicleJourney(vj);
  const stops = jp.scheduled_stop_point_in_journey_pattern_refs.data;

  const timetabledPassingTimes = buildTimetabledPassingTimeSequenceForStops(
    startTime,
    { vehicle_journey_id: vj.vehicle_journey_id },
    stops,
  );

  return {
    ...vehicleJourney,
    timetabled_passing_times: { data: timetabledPassingTimes },
  };
};

export const getVehicleJourneyTimes = (vj: VehicleJourneyInsertInputDeep) => {
  const passingTimes = vj.timetabled_passing_times.data;
  return {
    start: passingTimes[0].departure_time,
    end: passingTimes[passingTimes.length - 1].arrival_time,
    get duration() {
      return this.end - this.start;
    },
  };
};
