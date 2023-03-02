import { v4 as uuid } from 'uuid';
import { VehicleServiceInsertInput } from '../../types';
import { seedVehicleScheduleFramesByName } from './vehicleScheduleFrames';

// NOTE: These magical day type id's are populated in hasura.
// Maybe rather populate day type here and refer to it.
/* eslint-disable @typescript-eslint/no-unused-vars */
// Monday-Thursday
const MON_THUR_DAY_TYPE = '6781bd06-08cf-489e-a2bb-be9a07b15752';
// Monday-Friday
const MON_FRI_DAY_TYPE = '38853b0d-ec36-4110-b4bc-f53218c6cdcd';
// Monday
const MON_DAY_TYPE = 'd3dfb71f-8ee1-41fd-ad49-c4968c043290';
// Tuesday
const TUE_DAY_TYPE = 'c1d27421-dd3b-43b6-a0b9-7387aae488c9';
// Wednesday
const WED_DAY_TYPE = '5ec086a3-343c-42f0-a050-3464fc3d63de';
// Thursday
const THUR_DAY_TYPE = '9c708e58-fb49-440e-b4bd-736b9275f53f';
// Friday
const FRI_DAY_TYPE = '7176e238-d46e-4583-a567-b836b1ae2589';
// Saturday
const SAT_DAY_TYPE = '61374d2b-5cce-4a7d-b63a-d487f3a05e0d';
// Sunday
const SUN_DAY_TYPE = '0e1855f1-dfca-4900-a118-f608aa07e939';
/* eslint-enable @typescript-eslint/no-unused-vars */

const basicVehicleScheduleFrameId =
  seedVehicleScheduleFramesByName.winter2324.vehicle_schedule_frame_id;

const dec23VehicleScheduleFrameId =
  seedVehicleScheduleFramesByName.december23.vehicle_schedule_frame_id;

export const seedVehicleServicesByName = {
  // vehicle 1, Mon-Fri
  v1MonFri: {
    vehicle_service_id: uuid(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // vehicle 1, Sat
  v1Sat: {
    vehicle_service_id: uuid(),
    day_type_id: SAT_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // vehicle 1, Sun
  v1Sun: {
    vehicle_service_id: uuid(),
    day_type_id: SUN_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // vehicle 1, December 2023
  v1Dec2023: {
    vehicle_service_id: uuid(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: dec23VehicleScheduleFrameId,
  },
  // Hidden variant, Mon-Fri
  hiddenVariantMonFri: {
    vehicle_service_id: uuid(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
};

export const seedVehicleServices: VehicleServiceInsertInput[] = Object.values(
  seedVehicleServicesByName,
);
