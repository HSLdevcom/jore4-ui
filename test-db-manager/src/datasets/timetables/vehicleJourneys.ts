import { VehicleJourneyInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';
import { seedVehicleServiceBlocks } from './vehicleServiceBlocks';

const commonJourneyProps = {
  journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
  block_id: seedVehicleServiceBlocks[0].block_id,
};

export const seedVehicleJourneys: VehicleJourneyInsertInput[] = [
  // journey 1
  {
    vehicle_journey_id: '6f1a8bd0-2017-498f-9ad2-d7ff0ffb6001',
    ...commonJourneyProps,
  },
  // journey 2
  {
    vehicle_journey_id: '40bc64e0-08aa-47ba-b50d-54e4b64f0abb',
    ...commonJourneyProps,
  },
  // journey 3
  {
    vehicle_journey_id: '4dc5f622-afcf-41c6-9098-aa43db2f879b',
    ...commonJourneyProps,
  },
  // journey 4
  {
    vehicle_journey_id: 'ab5212f5-4ea0-4f17-be8d-3c9e7892bb72',
    ...commonJourneyProps,
  },
];
