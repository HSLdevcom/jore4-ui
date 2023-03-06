import omit from 'lodash/omit';
import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import { DayTypeId } from '../../datasets';
import {
  mergeTimetablesResources,
  TimetablesResources,
} from '../../db-helpers';
import {
  VehicleServiceInsertInput,
  VehicleServiceInsertInputDeep,
} from '../../types';
import { buildCount, Count } from '../common';
import {
  BlockSequenceBuilder,
  buildBlockSequence,
  flattenBlock,
} from './block';
import { buildTimeSequence, TimeSequenceParams } from './timeSequence';

export type VehicleServiceInstanceBuilder = Partial<VehicleServiceInsertInput>;

export const buildVehicleServiceInstance = (
  vehicleScheduleFrameId: UUID,
  dayTypeId: DayTypeId,
  vsBase: VehicleServiceInstanceBuilder,
): VehicleServiceInsertInput => ({
  vehicle_service_id: uuid(),
  ...vsBase,
  vehicle_schedule_frame_id: vehicleScheduleFrameId,
  day_type_id: dayTypeId,
});

export type VehicleServiceDeepBuilder = BlockSequenceBuilder & {
  vsBase: VehicleServiceInstanceBuilder;
};

export const buildVehicleServiceDeep = (
  vehicleScheduleFrameId: UUID,
  dayTypeId: DayTypeId,
  { vsBase, ...blockBuilder }: VehicleServiceDeepBuilder,
): VehicleServiceInsertInputDeep => {
  const vehicleService = buildVehicleServiceInstance(
    vehicleScheduleFrameId,
    dayTypeId,
    vsBase,
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
  vsDeparturesSequenceBuilder: TimeSequenceParams;
  vsCount: Count;
};

export const defaultVsSeqParams: Pick<
  VehicleServiceSequenceBuilder,
  'vsBase' | 'vsDeparturesSequenceBuilder' | 'vsCount'
> = {
  vsBase: {},
  vsCount: { min: 10, max: 20 },
  vsDeparturesSequenceBuilder: {
    minTime: Duration.fromISO('PT2M'),
    maxTime: Duration.fromISO('PT10M'),
  },
};

export const buildVehicleServiceSequence = (
  vehicleScheduleFrameId: UUID,
  dayTypeId: DayTypeId,
  {
    startTime,
    vsCount,
    vsDeparturesSequenceBuilder,
    ...rest
  }: VehicleServiceSequenceBuilder,
): VehicleServiceInsertInputDeep[] => {
  const vehicleServices: VehicleServiceInsertInputDeep[] = [];

  // how many vehicle services to generate?
  const count = buildCount(vsCount);

  // what times should the vehicles depart in the morning?
  const startTimes = buildTimeSequence(
    startTime,
    count,
    vsDeparturesSequenceBuilder,
  );

  for (let i = 0; i < count; i++) {
    const currentStartTime = startTimes[i];
    // build vehicle journey with its timetables passing times
    const block = buildVehicleServiceDeep(vehicleScheduleFrameId, dayTypeId, {
      startTime: currentStartTime,
      ...rest,
    });
    vehicleServices.push(block);
  }
  return vehicleServices;
};

export type VehicleServiceSequenceByDayTypeBuilder = {
  [dayTypeId: string]: VehicleServiceSequenceBuilder;
};

export const buildVehicleServiceSequencesByDayType = (
  vehicleScheduleFrameId: UUID,
  vsByDayType: VehicleServiceSequenceByDayTypeBuilder,
): VehicleServiceInsertInputDeep[] =>
  Object.entries(vsByDayType).flatMap(([dayTypeId, vsSequence]) =>
    buildVehicleServiceSequence(
      vehicleScheduleFrameId,
      dayTypeId as DayTypeId,
      vsSequence,
    ),
  );

export const flattenVehicleService = (
  vs: VehicleServiceInsertInputDeep,
): TimetablesResources => {
  const blockResources: TimetablesResources[] =
    vs.blocks.data.map(flattenBlock);
  const vehicleServiceResources: TimetablesResources = {
    vehicleServices: [
      // strip children references as they are inserted separately
      omit(vs, 'blocks'),
    ],
  };
  return mergeTimetablesResources([vehicleServiceResources, ...blockResources]);
};
