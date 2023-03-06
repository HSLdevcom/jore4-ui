import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import { DayTypeId } from '../../datasets';
import {
  VehicleServiceInsertInput,
  VehicleServiceInsertInputDeep,
} from '../../types';
import { buildCount, Count } from '../common';
import { buildLocalizedString } from '../entities';
import {
  BlockSequenceBuilder,
  buildBlockSequence,
  defaultBlockSequenceParams,
} from './block';
import { buildTimeSequence, TimeSequenceParams } from './timeSequence';
import { defaultTimetabledPassingTimeParams } from './timetabledPassingTime';
import { defaultVehicleJourneySequenceParams } from './vehicleJourney';

export type VehicleServiceInstanceBuilder = Partial<VehicleServiceInsertInput>;

export const buildVehicleServiceInstance = (
  vehicleScheduleFrameId: UUID,
  dayTypeId: DayTypeId,
  vehicleServiceBase: VehicleServiceInstanceBuilder,
): VehicleServiceInsertInput => ({
  vehicle_service_id: uuid(),
  ...vehicleServiceBase,
  vehicle_schedule_frame_id: vehicleScheduleFrameId,
  day_type_id: dayTypeId,
});

export type VehicleServiceDeepBuilder = BlockSequenceBuilder & {
  vehicleServiceBase: VehicleServiceInstanceBuilder;
};

export const buildVehicleServiceDeep = (
  vehicleScheduleFrameId: UUID,
  dayTypeId: DayTypeId,
  { vehicleServiceBase, ...blockBuilder }: VehicleServiceDeepBuilder,
): VehicleServiceInsertInputDeep => {
  const vehicleService = buildVehicleServiceInstance(
    vehicleScheduleFrameId,
    dayTypeId,
    vehicleServiceBase,
  );
  const blocks = buildBlockSequence(
    vehicleService.vehicle_service_id,
    blockBuilder,
  );
  return {
    ...vehicleService,
    blocks: { data: blocks },
  };
};

export type VehicleServiceSequenceBuilder = VehicleServiceDeepBuilder & {
  vehicleServiceDeparturesSequenceBuilder: TimeSequenceParams;
  vehicleServiceCount: Count;
};

export const defaultVehicleServiceSequenceParams = {
  vehicleServiceBase: {},
  vehicleServiceCount: { min: 10, max: 20 },
  vehicleServiceDeparturesSequenceBuilder: {
    minTime: Duration.fromISO('PT2M'),
    maxTime: Duration.fromISO('PT10M'),
  },
} satisfies Partial<VehicleServiceSequenceBuilder>;

export const defaultVehicleServiceByDayTypeParams = {
  ...defaultTimetabledPassingTimeParams,
  ...defaultVehicleJourneySequenceParams,
  ...defaultBlockSequenceParams,
  ...defaultVehicleServiceSequenceParams,
};

export const buildVehicleServiceSequence = (
  vehicleScheduleFrameId: UUID,
  dayTypeId: DayTypeId,
  {
    startTime,
    vehicleServiceCount: vsCount,
    vehicleServiceDeparturesSequenceBuilder: vsDeparturesSequenceBuilder,
    vehicleServiceBase,
    ...vehicleServiceBuildParams
  }: VehicleServiceSequenceBuilder,
): VehicleServiceInsertInputDeep[] => {
  const vehicleServices: VehicleServiceInsertInputDeep[] = [];

  // determine how many vehicle services to generate
  const count = buildCount(vsCount);

  // what times should the vehicles depart in the morning?
  const startTimes = buildTimeSequence(
    startTime,
    count,
    vsDeparturesSequenceBuilder,
  );

  for (let i = 0; i < count; i++) {
    const currentStartTime = startTimes[i];
    // build vehicle journey with its timetabled passing times
    const vehicleService = buildVehicleServiceDeep(
      vehicleScheduleFrameId,
      dayTypeId,
      {
        startTime: currentStartTime,
        vehicleServiceBase: {
          ...vehicleServiceBase,
          name_i18n: buildLocalizedString(`1234-${i}`),
        },
        ...vehicleServiceBuildParams,
      },
    );
    vehicleServices.push(vehicleService);
  }
  return vehicleServices;
};

export type VehicleServiceSequenceByDayTypeBuilder = {
  [dayTypeId: string]: VehicleServiceSequenceBuilder;
};

export const buildVehicleServiceSequencesByDayType = (
  vehicleScheduleFrameId: UUID,
  vehicleServiceByDayType: VehicleServiceSequenceByDayTypeBuilder,
): VehicleServiceInsertInputDeep[] =>
  Object.entries(vehicleServiceByDayType).flatMap(([dayTypeId, vsSequence]) =>
    buildVehicleServiceSequence(
      vehicleScheduleFrameId,
      dayTypeId as DayTypeId,
      vsSequence,
    ),
  );
