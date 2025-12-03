import {
  RequiredKeys,
  VehicleScheduleFrameInsertInput,
  VehicleScheduleFrameInsertInputDeep,
} from '../../types';
import { expectValue } from '../../utils';
import { buildLocalizedString } from '../entities';
import {
  VehicleServiceSequenceByDayTypeBuilder,
  buildVehicleServiceSequencesByDayType,
} from './vehicleService';

export type VehicleScheduleFrameInstanceBuilder = RequiredKeys<
  VehicleScheduleFrameInsertInput,
  'validity_start' | 'validity_end' | 'priority' | 'label'
>;

export const buildVehicleScheduleFrameInstance = (
  vehicleScheduleFrameBase: VehicleScheduleFrameInstanceBuilder,
): VehicleScheduleFrameInsertInput => ({
  vehicle_schedule_frame_id: crypto.randomUUID(),
  ...vehicleScheduleFrameBase,
  name_i18n: buildLocalizedString(expectValue(vehicleScheduleFrameBase.label)),
});

export type VehicleScheduleFrameDeepBuilder = {
  vehicleScheduleFrameBase: VehicleScheduleFrameInstanceBuilder;
  vehicleServiceByDayType: VehicleServiceSequenceByDayTypeBuilder;
};

export const buildVehicleScheduleFrameDeep = ({
  vehicleScheduleFrameBase,
  vehicleServiceByDayType,
}: VehicleScheduleFrameDeepBuilder): VehicleScheduleFrameInsertInputDeep => {
  const vehicleScheduleFrame = buildVehicleScheduleFrameInstance(
    vehicleScheduleFrameBase,
  );
  const vehicleServices = buildVehicleServiceSequencesByDayType(
    expectValue(vehicleScheduleFrame.vehicle_schedule_frame_id),
    vehicleServiceByDayType,
  );
  return {
    ...vehicleScheduleFrame,
    vehicle_services: { data: vehicleServices },
  };
};
