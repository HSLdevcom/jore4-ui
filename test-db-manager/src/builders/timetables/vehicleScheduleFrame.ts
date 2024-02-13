import { v4 as uuid } from 'uuid';
import {
  RequiredKeys,
  VehicleScheduleFrameInsertInput,
  VehicleScheduleFrameInsertInputDeep,
} from '../../types';
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
  vehicle_schedule_frame_id: uuid(),
  ...vehicleScheduleFrameBase,
  name_i18n: buildLocalizedString(vehicleScheduleFrameBase.label),
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
    vehicleScheduleFrame.vehicle_schedule_frame_id,
    vehicleServiceByDayType,
  );
  return {
    ...vehicleScheduleFrame,
    vehicle_services: { data: vehicleServices },
  };
};
