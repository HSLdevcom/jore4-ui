import reverse from 'lodash/reverse';
import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  BlockInsertInputDeep,
  VehicleServiceBlockInsertInput,
} from '../../types';
import { buildCount, Count } from '../common';
import { buildTimeSequence, TimeSequenceParams } from './timeSequence';
import {
  buildVehicleJourneySequence,
  getVehicleJourneyTimes,
  VehicleJourneySequenceBuilder,
} from './vehicleJourney';

export type BlockInstanceBuilder = Partial<VehicleServiceBlockInsertInput>;

/** Build a single block instance */
export const buildBlock = (
  vehicleServiceId: UUID,
  blockBase: BlockInstanceBuilder,
): VehicleServiceBlockInsertInput => ({
  block_id: uuid(),
  ...blockBase,
  vehicle_service_id: vehicleServiceId,
});

export type BlockDeepBuilder = VehicleJourneySequenceBuilder & {
  /** Default attributes the block instance will have */
  blockBase: BlockInstanceBuilder;
};

/** Build a block instance with its children
 * @param vehicleServiceId the ID of the vehicle service this block will belong to
 */
export const buildBlockDeep = (
  vehicleServiceId: UUID,
  { blockBase, ...vehicleJourneySequenceBuilder }: BlockDeepBuilder,
): BlockInsertInputDeep => {
  const block = buildBlock(vehicleServiceId, blockBase);
  const vehicleJourneys = buildVehicleJourneySequence(
    block.block_id,
    vehicleJourneySequenceBuilder,
  );
  return {
    ...block,
    vehicle_journeys: { data: vehicleJourneys },
  };
};

export const getBlockTimes = (block: BlockInsertInputDeep) => {
  const vehicleJourneys = block.vehicle_journeys.data;

  // find the first valid vehicle journey with a start time
  // note: vehicle journeys with no stops have no start and end time
  let start: Duration;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of vehicleJourneys) {
    start = getVehicleJourneyTimes(item).start;
    if (start) {
      break;
    }
  }

  // find the last valid vehicle journey with an end time
  // note: vehicle journeys with no stops have no start and end time
  let end: Duration;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of reverse(vehicleJourneys)) {
    end = getVehicleJourneyTimes(item).start;
    if (end) {
      break;
    }
  }

  const duration = start && end ? end.minus(start) : undefined;

  return { start, end, duration };
};

export type BlockSequenceBuilder = BlockDeepBuilder & {
  blockWaitSequenceBuilder: TimeSequenceParams;
  blockCount: Count;
};

export const defaultBlockSequenceParams = {
  blockBase: {},
  blockCount: { min: 1, max: 3 },
  blockWaitSequenceBuilder: {
    minTime: Duration.fromISO('PT1H'),
    maxTime: Duration.fromISO('PT5H'),
  },
} satisfies Partial<BlockSequenceBuilder>;

export const buildBlockSequence = (
  vehicleServiceId: UUID,
  {
    startTime,
    blockCount,
    blockWaitSequenceBuilder,
    ...blockBuildParams
  }: BlockSequenceBuilder,
): BlockInsertInputDeep[] => {
  const blocks: BlockInsertInputDeep[] = [];

  // determine how many blocks to generate
  const count = buildCount(blockCount);

  // what should be the waiting time after each block before the next one starts?
  const waitSequence = buildTimeSequence(
    Duration.fromISO('PT0S'),
    count,
    blockWaitSequenceBuilder,
  );

  let currentTime = startTime;
  for (let i = 0; i < count; i++) {
    // build block with its vehicle journeys
    const block = buildBlockDeep(vehicleServiceId, {
      startTime: currentTime,
      ...blockBuildParams,
    });
    blocks.push(block);

    // wait after the block before the next one starts
    const blockDuration =
      getBlockTimes(block).duration || Duration.fromMillis(0);
    const waitAfter = waitSequence[i];
    currentTime = currentTime.plus(blockDuration).plus(waitAfter);
  }
  return blocks;
};
