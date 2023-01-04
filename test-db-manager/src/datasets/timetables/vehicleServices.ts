import { v4 as uuid } from 'uuid';
import { VehicleServiceInsertInput } from '../../types';
import { seedVehicleScheduleFrames } from './vehicleScheduleFrames';

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
  seedVehicleScheduleFrames[0].vehicle_schedule_frame_id;
const importedVehicleScheduleFrameId =
  seedVehicleScheduleFrames[5].vehicle_schedule_frame_id;

const seedDefaultVehicleServices: VehicleServiceInsertInput[] = [
  // basic schedule frame, vehicle 1, Mon-Fri
  {
    vehicle_service_id: uuid(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // basic schedule frame, vehicle 1, Sat
  {
    vehicle_service_id: uuid(),
    day_type_id: SAT_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // basic schedule frame, vehicle 1, Sun
  {
    vehicle_service_id: uuid(),
    day_type_id: SUN_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // basic schedule frame, vehicle 2, Mon-Fri
  {
    vehicle_service_id: uuid(),
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // basic schedule frame, vehicle 2, Sat
  {
    vehicle_service_id: uuid(),
    day_type_id: SAT_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
  // basic schedule frame, vehicle 2, Sun
  {
    vehicle_service_id: uuid(),
    day_type_id: SUN_DAY_TYPE,
    vehicle_schedule_frame_id: basicVehicleScheduleFrameId,
  },
];

export const seedImportedVehicleServices: VehicleServiceInsertInput[] = [
  // imported schedule frame, vehicle 1, Mon-Fri
  {
    vehicle_service_id: '407d5e12-2f90-4ccb-9300-896f9673b473',
    day_type_id: MON_FRI_DAY_TYPE,
    vehicle_schedule_frame_id: importedVehicleScheduleFrameId,
  },
  // imported schedule frame, vehicle 1, Sat
  {
    vehicle_service_id: 'ff4e9832-c4c8-4498-b027-119e0b9757f9',
    day_type_id: SAT_DAY_TYPE,
    vehicle_schedule_frame_id: importedVehicleScheduleFrameId,
  },
  // imported schedule frame, vehicle 1, Sun
  {
    vehicle_service_id: 'a41f7614-d27f-4b65-bef0-cd554de01133',
    day_type_id: SUN_DAY_TYPE,
    vehicle_schedule_frame_id: importedVehicleScheduleFrameId,
  },
];

export const seedVehicleServices: VehicleServiceInsertInput[] = [
  ...seedDefaultVehicleServices,
  ...seedImportedVehicleServices,
];
