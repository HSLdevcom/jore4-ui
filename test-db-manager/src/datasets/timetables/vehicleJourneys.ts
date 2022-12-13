import { v4 as uuid } from 'uuid';
import { VehicleJourneyInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';
import { seedVehicleServiceBlocks } from './vehicleServiceBlocks';

const monFriBlockId = seedVehicleServiceBlocks[0].block_id;
const satBlockId = seedVehicleServiceBlocks[1].block_id;
const sunBlockId = seedVehicleServiceBlocks[2].block_id;

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

export const seedVehicleJourneys: VehicleJourneyInsertInput[] = [
  // Journeys 1-20, all belong to same journey pattern and service block (Vehicle 1 Mon-Fri)
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  buildVehicleJourney({ vehicleJourneyId: uuid() }),
  // Journeys 21-24, all belong to same journey pattern and service block (Vehicle 1 Sat)
  buildVehicleJourney({ vehicleJourneyId: uuid(), blockId: satBlockId }),
  buildVehicleJourney({ vehicleJourneyId: uuid(), blockId: satBlockId }),
  buildVehicleJourney({ vehicleJourneyId: uuid(), blockId: satBlockId }),
  buildVehicleJourney({ vehicleJourneyId: uuid(), blockId: satBlockId }),
  // journey 25, belongs to service block (Vehicle 1 Sun)
  buildVehicleJourney({ vehicleJourneyId: uuid(), blockId: sunBlockId }),
];
