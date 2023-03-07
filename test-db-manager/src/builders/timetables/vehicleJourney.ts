import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import { TimetablesResources } from '../../db-helpers';
import {
  JourneyPatternRefInsertInputDeep,
  JourneyType,
  VehicleJourneyInsertInput,
  VehicleJourneyInsertInputDeep,
} from '../../types';
import {
  ArrayItemPickMethod,
  buildCount,
  Count,
  pickArrayItem,
} from '../common';
import { buildTimeSequence, TimeSequenceParams } from './timeSequence';
import {
  buildTimetabledPassingTimeSequence,
  TimetabledPassingTimeSequenceBuilder,
} from './timetabledPassingTime';

export type VehicleJourneyInstanceBuilder = Partial<VehicleJourneyInsertInput>;
export const buildVehicleJourneyInstance = (
  blockId: UUID,
  jpRefId: UUID,
  vjBase: VehicleJourneyInstanceBuilder,
): VehicleJourneyInsertInput => ({
  vehicle_journey_id: uuid(),
  journey_type: JourneyType.Standard,
  is_backup_journey: false,
  is_extra_journey: false,
  is_vehicle_type_mandatory: false,
  ...vjBase,
  block_id: blockId,
  journey_pattern_ref_id: jpRefId,
});

export type VehicleJourneyDeepBuilder = Omit<
  TimetabledPassingTimeSequenceBuilder,
  'stops'
> & {
  vjBase: VehicleJourneyInstanceBuilder;
  jp: JourneyPatternRefInsertInputDeep;
};
export const buildVehicleJourneyDeep = (
  blockId: UUID,
  {
    tptBase,
    tptSequenceBuilder,
    vjBase,
    startTime,
    jp,
  }: VehicleJourneyDeepBuilder,
): VehicleJourneyInsertInputDeep => {
  // build the main vehicle journey entity
  const vehicleJourney = buildVehicleJourneyInstance(
    blockId,
    jp.journey_pattern_ref_id,
    {
      ...vjBase,
    },
  );

  // build the timetables passing times based on the journey pattern stops
  const stops = jp.scheduled_stop_point_in_journey_pattern_refs.data;
  const timetabledPassingTimes = buildTimetabledPassingTimeSequence(
    vehicleJourney.vehicle_journey_id,
    { tptBase, tptSequenceBuilder, startTime, stops },
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

export type VehicleJourneySequenceBuilder = Omit<
  VehicleJourneyDeepBuilder,
  'jp'
> & {
  vjWaitSequenceBuilder: TimeSequenceParams;
  vjCount: Count;
  jpRefList: JourneyPatternRefInsertInputDeep[];
  jpPickMethod: ArrayItemPickMethod;
};

export const defaultVjSeqParams: Pick<
  VehicleJourneySequenceBuilder,
  'vjBase' | 'vjWaitSequenceBuilder' | 'vjCount' | 'jpPickMethod'
> = {
  vjBase: {},
  vjCount: { min: 6, max: 8 },
  vjWaitSequenceBuilder: {
    minTime: Duration.fromISO('PT2M'),
    maxTime: Duration.fromISO('PT10M'),
  },
  jpPickMethod: 'modulo',
};

export const buildVehicleJourneySequence = (
  blockId: UUID,
  {
    startTime,
    vjWaitSequenceBuilder,
    vjCount,
    jpRefList,
    jpPickMethod,
    ...rest
  }: VehicleJourneySequenceBuilder,
): VehicleJourneyInsertInputDeep[] => {
  const vehicleJourneys: VehicleJourneyInsertInputDeep[] = [];

  // how many vehicle journeys to generate?
  const count = buildCount(vjCount);

  // what should be the waiting time after each vehicle journey before the next one starts?
  const waitSequence = buildTimeSequence(
    startTime,
    count,
    vjWaitSequenceBuilder,
  );

  let currentTime = startTime;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    // which journey pattern to generate vehicle journey for?
    const jp = pickArrayItem(jpPickMethod, jpRefList, i);

    // build vehicle journey with its timetables passing times
    const vj = buildVehicleJourneyDeep(blockId, {
      startTime: currentTime,
      jp,
      ...rest,
    });
    vehicleJourneys.push(vj);

    // wait after the vehicle journey before the next one starts
    const vjDuration = getVehicleJourneyTimes(vj).duration;
    const waitAfter = waitSequence[i];
    currentTime = currentTime.plus(vjDuration).plus(waitAfter);
  }
  return vehicleJourneys;
};

export const flattenVehicleJourney = (
  vj: VehicleJourneyInsertInputDeep,
): TimetablesResources => ({
  vehicleJourneys: [vj],
  timetabledPassingTimes: vj.timetabled_passing_times.data,
});
