import { v4 as uuid } from 'uuid';
import { JourneyType, VehicleJourneyInsertInput } from '../../types';

export type VehicleJourneyBuildInput = RequiredKeysOnly<
  VehicleJourneyInsertInput,
  'block_id' | 'journey_pattern_ref_id'
>;
export const buildBlock = (
  vj: VehicleJourneyBuildInput,
): VehicleJourneyInsertInput => ({
  vehicle_journey_id: uuid(),
  journey_type: JourneyType.Standard,
  is_backup_journey: false,
  is_extra_journey: false,
  is_vehicle_type_mandatory: false,
  ...vj,
});
