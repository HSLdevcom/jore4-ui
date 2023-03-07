import { v4 as uuid } from 'uuid';
import {
  mergeTimetablesResources,
  TimetablesResources,
} from '../../db-helpers';
import {
  VehicleScheduleFrameInsertInput,
  VehicleScheduleFrameInsertInputDeep,
} from '../../types';
import {
  buildVehicleServiceSequencesByDayType,
  flattenVehicleService,
  VehicleServiceSequenceByDayTypeBuilder,
} from './vehicleService';

export type VehicleScheduleFrameInstanceBuilder = RequiredKeys<
  VehicleScheduleFrameInsertInput,
  'name_i18n' | 'validity_start' | 'validity_end' | 'priority'
>;

export const buildVehicleScheduleFrameInstance = (
  vsfBase: VehicleScheduleFrameInstanceBuilder,
): VehicleScheduleFrameInsertInput => ({
  vehicle_schedule_frame_id: uuid(),
  ...vsfBase,
});

export type VehicleScheduleFrameDeepBuilder = {
  vsfBase: VehicleScheduleFrameInstanceBuilder;
  vsByDay: VehicleServiceSequenceByDayTypeBuilder;
};

export const buildVehicleScheduleFrameDeep = ({
  vsfBase,
  vsByDay,
}: VehicleScheduleFrameDeepBuilder): VehicleScheduleFrameInsertInputDeep => {
  const vehicleScheduleFrame = buildVehicleScheduleFrameInstance(vsfBase);
  const vehicleServices = buildVehicleServiceSequencesByDayType(
    vehicleScheduleFrame.vehicle_schedule_frame_id,
    vsByDay,
  );
  return {
    ...vehicleScheduleFrame,
    vehicle_services: { data: vehicleServices },
  };
};

export const flattenVehicleScheduleFrame = (
  vsf: VehicleScheduleFrameInsertInputDeep,
): TimetablesResources => {
  const vehicleServiceResources: TimetablesResources[] =
    vsf.vehicle_services.data.map(flattenVehicleService);
  const vehicleScheduleFrameResources: TimetablesResources = {
    vehicleScheduleFrames: [vsf],
  };
  return mergeTimetablesResources([
    vehicleScheduleFrameResources,
    ...vehicleServiceResources,
  ]);
};
