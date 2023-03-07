import omit from 'lodash/omit';
import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  mergeTimetablesResources,
  TimetablesResources,
} from '../../db-helpers';
import {
  BlockInsertInputDeep,
  VehicleServiceBlockInsertInput,
} from '../../types';
import { buildCount, Count } from '../common';
import { buildTimeSequence, TimeSequenceParams } from './timeSequence';
import {
  buildVehicleJourneySequence,
  flattenVehicleJourney,
  getVehicleJourneyTimes,
  VehicleJourneySequenceBuilder,
} from './vehicleJourney';

export type BlockInstanceBuilder = Partial<VehicleServiceBlockInsertInput>;

export const buildBlock = (
  vehicleServiceId: UUID,
  blockBase: BlockInstanceBuilder,
): VehicleServiceBlockInsertInput => ({
  block_id: uuid(),
  ...blockBase,
  vehicle_service_id: vehicleServiceId,
});

export type BlockDeepBuilder = VehicleJourneySequenceBuilder & {
  blockBase: BlockInstanceBuilder;
};

export const buildBlockDeep = (
  vehicleServiceId: UUID,
  { blockBase, ...vjSeqBuilder }: BlockDeepBuilder,
): BlockInsertInputDeep => {
  const block = buildBlock(vehicleServiceId, blockBase);
  const vehicleJourneys = buildVehicleJourneySequence(
    block.block_id,
    vjSeqBuilder,
  );
  return {
    ...block,
    vehicle_journeys: { data: vehicleJourneys },
  };
};

export const getBlockTimes = (block: BlockInsertInputDeep) => {
  const vehicleJourneys = block.vehicle_journeys.data;

  const { start } = getVehicleJourneyTimes(vehicleJourneys[0]);
  const { end } = getVehicleJourneyTimes(
    vehicleJourneys[vehicleJourneys.length - 1],
  );
  const duration = end.minus(start);

  return { start, end, duration };
};

export type BlockSequenceBuilder = BlockDeepBuilder & {
  blockWaitSequenceBuilder: TimeSequenceParams;
  blockCount: Count;
};

export const defaultBlockSeqParams: Pick<
  BlockSequenceBuilder,
  'blockBase' | 'blockWaitSequenceBuilder' | 'blockCount'
> = {
  blockBase: {},
  blockCount: { min: 1, max: 3 },
  blockWaitSequenceBuilder: {
    minTime: Duration.fromISO('PT1H'),
    maxTime: Duration.fromISO('PT5H'),
  },
};

export const buildBlockSequence = (
  vehicleServiceId: UUID,
  {
    startTime,
    blockCount,
    blockWaitSequenceBuilder,
    ...rest
  }: BlockSequenceBuilder,
): BlockInsertInputDeep[] => {
  const blocks: BlockInsertInputDeep[] = [];

  // how many blocks to generate?
  const count = buildCount(blockCount);

  // what should be the waiting time after each block before the next one starts?
  const waitSequence = buildTimeSequence(
    startTime,
    count,
    blockWaitSequenceBuilder,
  );

  let currentTime = startTime;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    // build vehicle journey with its timetables passing times
    const block = buildBlockDeep(vehicleServiceId, {
      startTime: currentTime,
      ...rest,
    });
    blocks.push(block);

    // wait after the vehicle journey before the next one starts
    const blockDuration = getBlockTimes(block).duration;
    const waitAfter = waitSequence[i];
    currentTime = currentTime.plus(blockDuration).plus(waitAfter);
  }
  return blocks;
};

export const flattenBlock = (
  block: BlockInsertInputDeep,
): TimetablesResources => {
  const vehicleJourneyResources: TimetablesResources[] =
    block.vehicle_journeys.data.map(flattenVehicleJourney);
  const blockResources: TimetablesResources = {
    vehicleServiceBlocks: [
      // strip children references as they are inserted separately
      omit(block, 'vehicle_journeys'),
    ],
  };
  return mergeTimetablesResources([blockResources, ...vehicleJourneyResources]);
};
