import { VehicleServiceInsertInput } from '../../types';
import { MON_FRI_DAY_TYPE, SAT_DAY_TYPE, SUN_DAY_TYPE } from './dayTypes';
import { seedVehicleScheduleFramesByName } from './vehicleScheduleFrames';

const basicVehicleScheduleFrameId =
  seedVehicleScheduleFramesByName.winter2324.vehicle_schedule_frame_id;

const dec23VehicleScheduleFrameId =
  seedVehicleScheduleFramesByName.december23.vehicle_schedule_frame_id;

export const seedVehicleServicesByName = {
  // vehicle 1, Mon-Fri
  v1MonFri: {
    vehicle_service_id: crypto.randomUUID(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // vehicle 1, Sat
  v1Sat: {
    vehicle_service_id: crypto.randomUUID(),
    day_type_id: SAT_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // vehicle 1, Sun
  v1Sun: {
    vehicle_service_id: crypto.randomUUID(),
    day_type_id: SUN_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // vehicle 1, December 2023
  v1Dec2023: {
    vehicle_service_id: crypto.randomUUID(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: dec23VehicleScheduleFrameId,
  },
  // Hidden variant, Mon-Fri
  hiddenVariantMonFri: {
    vehicle_service_id: crypto.randomUUID(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
};

export const seedVehicleServices: VehicleServiceInsertInput[] = Object.values(
  seedVehicleServicesByName,
);
