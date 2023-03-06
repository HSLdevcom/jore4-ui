import { Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  BlockInsertInputDeep,
  JourneyPatternRefInsertInputDeep,
  VehicleServiceBlockInsertInput,
} from '../../types';
import { buildVehicleJourneySequenceWithPassingTimes } from './vehicleJourney';

export type BlockBuildInput = RequiredKeysOnly<
  VehicleServiceBlockInsertInput,
  'vehicle_service_id'
>;

export const buildBlock = (
  blockBase: BlockBuildInput,
): VehicleServiceBlockInsertInput => ({
  block_id: uuid(),
  ...blockBase,
});

export const buildBlockWithPassingTimes = (
  blockBase: BlockBuildInput,
  startTime: Duration,
  journeyPatterns: JourneyPatternRefInsertInputDeep[],
): BlockInsertInputDeep => {
  const block = buildBlock(blockBase);
  const vehicleJourneys = buildVehicleJourneySequenceWithPassingTimes(
    startTime,
    { block_id: block.block_id },
    journeyPatterns,
    8,
  );
  return {
    ...block,
    vehicle_journeys: { data: vehicleJourneys },
  };
};
