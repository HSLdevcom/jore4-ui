import {
  seedJourneyPatternRefs,
  seedStopsInJourneyPatternRefs,
  seedTimetabledPassingTimes,
  seedVehicleJourneys,
  seedVehicleScheduleFrames,
  seedVehicleServiceBlocks,
  seedVehicleServices,
} from './datasets/timetables';
import { buildStagingSeed } from './datasets/timetables/staging';
import { TimetablesResources, populateTimetablesDb } from './db-helpers';

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

  const stagingTimeTables = buildStagingSeed(seedStopsInJourneyPatternRefs);

  await populateTimetablesDb(stagingTimeTables);
};

const seedDb = async () => {
  seedTimetables(seedTimetablesResources);
};

seedDb();
