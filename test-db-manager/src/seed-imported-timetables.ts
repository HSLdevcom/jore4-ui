import {
  seedImportedTimetabledPassingTimes,
  seedImportedVehicleJourneys,
  seedImportedVehicleScheduleFrames,
  seedImportedVehicleServiceBlocks,
  seedImportedVehicleServices,
} from './datasets/timetables';
import { TimetablesResources, populateTimetablesDb } from './db-helpers';

const seedTimetablesResources: TimetablesResources = {
  vehicleScheduleFrames: seedImportedVehicleScheduleFrames,
  vehicleServices: seedImportedVehicleServices,
  vehicleServiceBlocks: seedImportedVehicleServiceBlocks,
  vehicleJourneys: seedImportedVehicleJourneys,
  timetabledPassingTimes: seedImportedTimetabledPassingTimes,
};

const seedDb = async () => {
  await populateTimetablesDb(seedTimetablesResources);
};

seedDb();
