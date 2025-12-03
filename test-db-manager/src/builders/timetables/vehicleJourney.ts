import { Duration } from 'luxon';
import {
  JourneyPatternRefInsertInputDeep,
  JourneyType,
  VehicleJourneyInsertInput,
  VehicleJourneyInsertInputDeep,
} from '../../types';
import { expectValue } from '../../utils';
import {
  ArrayItemPickMethod,
  Count,
  buildCount,
  pickArrayItem,
} from '../common';
import { buildLocalizedString } from '../entities';
import { TimeSequenceParams, buildTimeSequence } from './timeSequence';
import {
  TimetabledPassingTimeSequenceBuilder,
  buildTimetabledPassingTimeSequence,
} from './timetabledPassingTime';

/** Parameters for building a single vehicle journey instance */
export type VehicleJourneyInstanceBuilder = Partial<VehicleJourneyInsertInput>;

/** Build a single vehicle journey instance
 * @param blockId the block the vehicle journey will belong to
 * @param journeyPatternRefId the journey pattern ref the vehicle journey will belong to
 * @param vehicleJourneyBase default attributes the vehicle journey will have
 */
export const buildVehicleJourneyInstance = (
  blockId: UUID,
  journeyPatternRefId: UUID,
  vehicleJourneyBase: VehicleJourneyInstanceBuilder,
): VehicleJourneyInsertInput => ({
  vehicle_journey_id: crypto.randomUUID(),
  contract_number: 'DEFAULT_CONTRACT',
  journey_type: JourneyType.Standard,
  is_backup_journey: false,
  is_extra_journey: false,
  is_vehicle_type_mandatory: false,
  journey_name_i18n: vehicleJourneyBase.displayed_name
    ? buildLocalizedString(vehicleJourneyBase.displayed_name)
    : undefined,
  ...vehicleJourneyBase,
  block_id: blockId,
  journey_pattern_ref_id: journeyPatternRefId,
});

/** Parameters for building a single vehicle journey instance with its children */
export type VehicleJourneyDeepBuilder = Omit<
  TimetabledPassingTimeSequenceBuilder,
  'stops'
> & {
  /**
   * default attributes the vehicle journey will have
   */
  vehicleJourneyBase: VehicleJourneyInstanceBuilder;
  /**
   * the journey pattern this vehicle journey will describe the timetables for
   */
  journeyPattern: JourneyPatternRefInsertInputDeep;
};

/** Building a vehicle journey instance with its children
 * @param blockId the ID of the block this vehicle journey will belong to
 */
export const buildVehicleJourneyDeep = (
  blockId: UUID,
  {
    vehicleJourneyBase,
    journeyPattern,
    ...timetabledPassingTimeBuildParams
  }: VehicleJourneyDeepBuilder,
): VehicleJourneyInsertInputDeep => {
  // build the main vehicle journey entity
  const vehicleJourney = buildVehicleJourneyInstance(
    blockId,
    expectValue(journeyPattern.journey_pattern_ref_id),
    vehicleJourneyBase,
  );

  // build the timetabled passing time based on the journey pattern stops
  const stops =
    journeyPattern.scheduled_stop_point_in_journey_pattern_refs.data;
  const timetabledPassingTimes = buildTimetabledPassingTimeSequence(
    expectValue(vehicleJourney.vehicle_journey_id),
    { stops, ...timetabledPassingTimeBuildParams },
  );

  return {
    ...vehicleJourney,
    timetabled_passing_times: { data: timetabledPassingTimes },
  };
};

export const getVehicleJourneyTimes = (
  vehicleJourney: VehicleJourneyInsertInputDeep,
) => {
  // cannot determine the beginning and end for a vehicle journey that has <2 stops
  if (vehicleJourney.timetabled_passing_times.data.length < 2) {
    return {
      start: undefined,
      end: undefined,
      duration: Duration.fromMillis(0),
    };
  }

  const passingTimes = vehicleJourney.timetabled_passing_times.data;

  // we do know that the first timetabled passing time always has departure time and the last always has an arrival time, can skip the null check
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const start = passingTimes[0].departure_time!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const end = passingTimes[passingTimes.length - 1].arrival_time!;
  const duration = end.minus(start);

  return { start, end, duration };
};

export type VehicleJourneySequenceBuilder = Omit<
  VehicleJourneyDeepBuilder,
  'journeyPattern'
> & {
  vehicleJourneyWaitSequenceBuilder: TimeSequenceParams;
  vehicleJourneyCount: Count;
  journeyPatternRefList: JourneyPatternRefInsertInputDeep[];
  journeyPatternPickMethod: ArrayItemPickMethod;
};

export const defaultVehicleJourneySequenceParams = {
  vehicleJourneyBase: {},
  vehicleJourneyCount: { min: 6, max: 8 },
  vehicleJourneyWaitSequenceBuilder: {
    minTime: Duration.fromISO('PT2M'),
    maxTime: Duration.fromISO('PT10M'),
  },
  journeyPatternPickMethod: 'modulo',
} satisfies Partial<VehicleJourneySequenceBuilder>;

export const buildVehicleJourneySequence = (
  blockId: UUID,
  {
    startTime,
    vehicleJourneyWaitSequenceBuilder,
    vehicleJourneyCount,
    vehicleJourneyBase,
    journeyPatternRefList,
    journeyPatternPickMethod,
    ...vehicleJourneyBuildParams
  }: VehicleJourneySequenceBuilder,
): VehicleJourneyInsertInputDeep[] => {
  const vehicleJourneys: VehicleJourneyInsertInputDeep[] = [];

  // determine how many vehicle journeys to generate
  const count = buildCount(vehicleJourneyCount);

  // calculate the waiting times after each vehicle journey before the next one starts
  const waitSequence = buildTimeSequence(
    Duration.fromISO('PT0S'),
    count,
    vehicleJourneyWaitSequenceBuilder,
  );

  let currentTime = startTime;
  for (let i = 0; i < count; i++) {
    // pick a journey pattern to generate vehicle journey for
    const journeyPattern = pickArrayItem(
      journeyPatternPickMethod,
      journeyPatternRefList,
      i,
    );

    // build vehicle journey with its timetabled passing times
    const vehicleJourney = buildVehicleJourneyDeep(blockId, {
      startTime: currentTime,
      journeyPattern,
      vehicleJourneyBase: {
        displayed_name: `trip ${count}`,
        contract_number: 'DEFAULT_CONTRACT',
        ...vehicleJourneyBase,
      },
      ...vehicleJourneyBuildParams,
    });
    vehicleJourneys.push(vehicleJourney);

    // wait after the vehicle journey before the next one starts
    const vehicleJourneyDuration =
      getVehicleJourneyTimes(vehicleJourney).duration;
    const waitAfter = waitSequence[i];
    currentTime = currentTime.plus(vehicleJourneyDuration).plus(waitAfter);
  }
  return vehicleJourneys;
};
