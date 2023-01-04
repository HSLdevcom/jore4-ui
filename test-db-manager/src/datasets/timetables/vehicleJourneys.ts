import times from 'lodash/times';
import { v4 as uuid } from 'uuid';
import { VehicleJourneyInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';
import { seedVehicleServiceBlocks } from './vehicleServiceBlocks';

const monFriBlockId = seedVehicleServiceBlocks[0].block_id;
const satBlockId = seedVehicleServiceBlocks[1].block_id;
const sunBlockId = seedVehicleServiceBlocks[2].block_id;
const importedMonFriBlockId = seedVehicleServiceBlocks[6].block_id;

const buildVehicleJourney = ({
  vehicleJourneyId,
  journeyPatternRefId = seedJourneyPatternRefs[0].journey_pattern_ref_id,
  blockId = monFriBlockId,
}: {
  vehicleJourneyId: UUID;
  journeyPatternRefId?: UUID;
  blockId?: UUID;
}): VehicleJourneyInsertInput => ({
  vehicle_journey_id: vehicleJourneyId,
  journey_pattern_ref_id: journeyPatternRefId,
  block_id: blockId,
});

const seedDefaultVehicleJourneys: VehicleJourneyInsertInput[] = [
  // Journeys 1-20, all belong to same journey pattern and service block (Vehicle 1 Mon-Fri)
  ...times(20, () => buildVehicleJourney({ vehicleJourneyId: uuid() })),
  // Journeys 21-25, opposite direction (Vehicle 1 Mon-Fri)
  ...times(5, () =>
    buildVehicleJourney({
      vehicleJourneyId: uuid(),
      journeyPatternRefId: seedJourneyPatternRefs[1].journey_pattern_ref_id,
    }),
  ),
  // Journeys 26-29, all belong to same journey pattern and service block (Vehicle 1 Sat)
  ...times(4, () =>
    buildVehicleJourney({ vehicleJourneyId: uuid(), blockId: satBlockId }),
  ),
  // journey 30, belongs to service block (Vehicle 1 Sun)
  buildVehicleJourney({ vehicleJourneyId: uuid(), blockId: sunBlockId }),
];

export const seedImportedVehicleJourneys: VehicleJourneyInsertInput[] = [
  // Journeys 25-30, belong to same journey pattern and imported service block (Vehicle 1 Mon-Fri)
  buildVehicleJourney({
    vehicleJourneyId: '441acd20-2028-41a3-9d34-053e1c74aab0',
    blockId: importedMonFriBlockId,
  }),
  buildVehicleJourney({
    vehicleJourneyId: '159d4cd4-f68c-4b06-a67b-7be2e7c590d2',
    blockId: importedMonFriBlockId,
  }),
  buildVehicleJourney({
    vehicleJourneyId: '4633a469-8f06-48b1-b0ed-085eb4f2ca46',
    blockId: importedMonFriBlockId,
  }),
  buildVehicleJourney({
    vehicleJourneyId: 'bc468c06-6e1c-44b8-995f-e85f78064b01',
    blockId: importedMonFriBlockId,
  }),
  buildVehicleJourney({
    vehicleJourneyId: '989312fa-8112-4e35-aad5-9e61da7ba43f',
    blockId: importedMonFriBlockId,
  }),
];

export const seedVehicleJourneys = [
  ...seedDefaultVehicleJourneys,
  ...seedImportedVehicleJourneys,
];
