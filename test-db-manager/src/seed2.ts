import reverse from 'lodash/reverse';
import { DateTime, Duration } from 'luxon';
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
  SAT_DAY_TYPE,
  SUN_DAY_TYPE,
} from './datasets/timetables';
import {
  mergeTimetablesResources,
  populateTimetablesDb,
  TimetablesResources,
} from './db-helpers';
import { Priority } from './types';

const seedTimetables = async (resources: TimetablesResources) => {
  await populateTimetablesDb(resources);
};

const seedDb = async () => {
  const stopLabels = buildLabelArray('H22', 10);
  const hastusStopLabels = [stopLabels[0], stopLabels[4], stopLabels[9]];

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

  // basic priority, 2022-2030, Monday-Sunday, route 641 back and forth
  const vsf1 = buildVehicleScheduleFrameDeep({
    vsfBase: {
      label: '641 basic',
      priority: Priority.Standard,
      validity_start: DateTime.fromISO('2022-01-01'),
      validity_end: DateTime.fromISO('2030-12-31'),
    },
    vsByDay: {
      [MON_FRI_DAY_TYPE]: {
        ...defaultTptSeqParams,
        ...defaultVjSeqParams,
        ...defaultBlockSeqParams,
        ...defaultVsSeqParams,
        jpRefList: [jpRef1, jpRef2],
        startTime: Duration.fromISO('PT5H15M'),
        hastusStopLabels,
      },
      [SAT_DAY_TYPE]: {
        ...defaultTptSeqParams,
        ...defaultVjSeqParams,
        ...defaultBlockSeqParams,
        ...defaultVsSeqParams,
        startTime: Duration.fromISO('PT4H45M'),
        vsCount: { min: 4, max: 6 }, // less buses ride today
        jpRefList: [jpRef1, jpRef2],
        hastusStopLabels,
      },
      [SUN_DAY_TYPE]: {
        ...defaultTptSeqParams,
        ...defaultVjSeqParams,
        ...defaultBlockSeqParams,
        ...defaultVsSeqParams,
        startTime: Duration.fromISO('PT8H15M'), // first bus departs late
        vsCount: { min: 4, max: 6 }, // less buses ride today
        jpRefList: [jpRef1, jpRef2],
        hastusStopLabels,
      },
    },
  });

  // temporary priority, 2022-2030, Saturday, route 641 back and forth
  const vsf2 = buildVehicleScheduleFrameDeep({
    vsfBase: {
      label: '641 temporary',
      priority: Priority.Temporary,
      validity_start: DateTime.fromISO('2023-01-01'),
      validity_end: DateTime.fromISO('2023-12-31'),
    },
    vsByDay: {
      [SAT_DAY_TYPE]: {
        ...defaultTptSeqParams,
        ...defaultVjSeqParams,
        ...defaultBlockSeqParams,
        ...defaultVsSeqParams,
        startTime: Duration.fromISO('PT4H45M'),
        vsCount: { min: 14, max: 16 }, // more buses ride today
        jpRefList: [jpRef1, jpRef2],
        hastusStopLabels,
      },
    },
  });

  const timetablesResources = mergeTimetablesResources([
    flattenJourneyPatternRef(jpRef1),
    flattenJourneyPatternRef(jpRef2),
    flattenVehicleScheduleFrame(vsf1),
    flattenVehicleScheduleFrame(vsf2),
  ]);

  await seedTimetables(timetablesResources);
};

seedDb();
