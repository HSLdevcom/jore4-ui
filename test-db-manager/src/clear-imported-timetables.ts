import {
  seedImportedTimetabledPassingTimes,
  seedImportedVehicleJourneys,
  seedImportedVehicleScheduleFrames,
  seedImportedVehicleServiceBlocks,
  seedImportedVehicleServices,
} from './datasets/timetables';
import { TimetablesResources, clearTimetablesDb } from './db-helpers';

const seedTimetablesResources: TimetablesResources = {
  vehicleScheduleFrames: seedImportedVehicleScheduleFrames,
  vehicleServices: seedImportedVehicleServices,
  vehicleServiceBlocks: seedImportedVehicleServiceBlocks,
  vehicleJourneys: seedImportedVehicleJourneys,
  timetabledPassingTimes: seedImportedTimetabledPassingTimes,
};

const clearImportedTimetables = async () => {
  await clearTimetablesDb(seedTimetablesResources);
};

clearImportedTimetables();
