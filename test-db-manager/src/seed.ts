import {
  seedJourneyPatternRefs,
  seedStopsInJourneyPatternRefs,
  seedTimetabledPassingTimes,
  seedVehicleJourneys,
  seedVehicleScheduleFrames,
  seedVehicleServiceBlocks,
  seedVehicleServices,
} from './datasets/timetables';
import { populateTimetablesDb, TimetablesResources } from './db-helpers';

const seedTimetablesResources: TimetablesResources = {
  journeyPatternRefs: seedJourneyPatternRefs,
  stopsInJourneyPatternRefs: seedStopsInJourneyPatternRefs,
  vehicleScheduleFrames: seedVehicleScheduleFrames,
  vehicleServices: seedVehicleServices,
  vehicleServiceBlocks: seedVehicleServiceBlocks,
  vehicleJourneys: seedVehicleJourneys,
  timetabledPassingTimes: seedTimetabledPassingTimes,
};

const seedTimetables = async (resources: TimetablesResources) => {
  await populateTimetablesDb(resources);
};

const seedDb = async () => {
  seedTimetables(seedTimetablesResources);
};

seedDb();
