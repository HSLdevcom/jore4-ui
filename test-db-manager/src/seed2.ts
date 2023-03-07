import reverse from 'lodash/reverse';
import { DateTime, Duration } from 'luxon';
import { buildLocalizedString } from './builders';
import { buildLabelArray } from './builders/common';
import {
  buildJourneyPatternRefDeep,
  buildVehicleScheduleFrameDeep,
  defaultBlockSeqParams,
  defaultTptSeqParams,
  defaultVjSeqParams,
  defaultVsSeqParams,
  flattenJourneyPatternRef,
  flattenVehicleScheduleFrame,
} from './builders/timetables';
import {
  MON_FRI_DAY_TYPE,
  seedJourneyPatternRefs,
  seedStopsInJourneyPatternRefs,
  seedTimetabledPassingTimes,
  seedVehicleJourneys,
  seedVehicleScheduleFrames,
  seedVehicleServiceBlocks,
  seedVehicleServices,
} from './datasets/timetables';
import {
  mergeTimetablesResources,
  populateTimetablesDb,
  TimetablesResources,
} from './db-helpers';
import { Priority } from './types';

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
  const stopLabels = buildLabelArray('H22', 10);

  // route 641, direction 1
  const jp1 = 'a9136ad8-d185-4c7b-9969-057b65dc9b00';
  const jpRef1 = buildJourneyPatternRefDeep(jp1, {
    jpBase: {},
    stopBase: {},
    stopLabels,
  });

  // route 641, direction 2
  const jp2 = '4f80b9c2-21b2-4460-9e38-0d0691b29cbe';
  const jpRef2 = buildJourneyPatternRefDeep(jp2, {
    jpBase: {},
    stopBase: {},
    stopLabels: reverse(stopLabels),
  });

  // basic priority, 2022-2030, Monday-Sunday
  const vsf1 = buildVehicleScheduleFrameDeep({
    vsfBase: {
      name_i18n: buildLocalizedString('basic'),
      priority: Priority.Standard,
      validity_start: DateTime.fromISO('2022-01-01'),
      validity_end: DateTime.fromISO('2030-12-31'),
    },
    [MON_FRI_DAY_TYPE]: {
      startTime: Duration.fromISO('PT5H15M'),
      ...defaultTptSeqParams,
      ...defaultVjSeqParams,
      ...defaultBlockSeqParams,
      ...defaultVsSeqParams,
      jpRefList: [jpRef1, jpRef2],
    },
  });

  const timetablesResources = mergeTimetablesResources([
    flattenJourneyPatternRef(jpRef1),
    flattenJourneyPatternRef(jpRef2),
    flattenVehicleScheduleFrame(vsf1),
  ]);

  await seedTimetables(timetablesResources);
};

seedDb();
