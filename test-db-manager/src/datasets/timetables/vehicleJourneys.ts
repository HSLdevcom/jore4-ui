import times from 'lodash/times';
import { v4 as uuid } from 'uuid';
import { JourneyType, VehicleJourneyInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';
import { seedVehicleServiceBlocksByName } from './vehicleServiceBlocks';

const monFriBlockId = seedVehicleServiceBlocksByName.v1MonFri.block_id;
const satBlockId = seedVehicleServiceBlocksByName.v1Sat.block_id;
const sunBlockId = seedVehicleServiceBlocksByName.v1Sun.block_id;
const decBlockId = seedVehicleServiceBlocksByName.v1December23.block_id;

const buildVehicleJourney = ({
  vehicleJourneyId,
  journeyPatternRefId = seedJourneyPatternRefs[0].journey_pattern_ref_id,
  blockId = monFriBlockId,
  journeyType = JourneyType.Standard,
  isVehicleTypeMandatory = false,
  isBackupJourney = false,
  isExtraJourney = false,
}: {
  vehicleJourneyId: UUID;
  journeyPatternRefId?: UUID;
  blockId?: UUID;
  isVehicleTypeMandatory?: boolean;
  isBackupJourney?: boolean;
  isExtraJourney?: boolean;
  journeyType?: JourneyType;
}): VehicleJourneyInsertInput => ({
  vehicle_journey_id: vehicleJourneyId,
  journey_pattern_ref_id: journeyPatternRefId,
  block_id: blockId,
  journey_type: journeyType,
  is_vehicle_type_mandatory: isVehicleTypeMandatory,
  is_backup_journey: isBackupJourney,
  is_extra_journey: isExtraJourney,
});

export const seedVehicleJourneys: VehicleJourneyInsertInput[] = [
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
  // journeys 31-40 (Vehicle 1 Mon-Fri December 2023, special priority)
  ...times(10, () =>
    buildVehicleJourney({
      vehicleJourneyId: uuid(),
      blockId: decBlockId,
    }),
  ),
];
