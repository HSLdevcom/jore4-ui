import reverse from 'lodash/reverse';
import { DateTime, Duration } from 'luxon';
import { buildLabelArray } from './builders/common';
import {
  buildJourneyPatternRefDeep,
  buildVehicleScheduleFrameDeep,
  defaultVehicleServiceByDayTypeParams,
} from './builders/timetables';
import {
  MON_FRI_DAY_TYPE,
  SAT_DAY_TYPE,
  SUN_DAY_TYPE,
} from './datasets/timetables';
import {
  TimetablesResources,
  flattenJourneyPatternRef,
  flattenVehicleScheduleFrame,
  mergeTimetablesResources,
  populateTimetablesDb,
} from './db-helpers';
import { getVehicleTypes } from './queries/timetables';
import { Priority } from './types';

const seedTimetables = async (resources: TimetablesResources) => {
  await populateTimetablesDb(resources);
};

const seedDb = async () => {
  const stopLabels = buildLabelArray('H22', 10);
  const hastusStopLabels = [stopLabels[0], stopLabels[4], stopLabels[9]];
  const vehicleTypesResult = await getVehicleTypes();

  const vehicleTypes =
    vehicleTypesResult.data.timetables.timetables_vehicle_type_vehicle_type;

  // route 641, direction 1
  const jp1 = 'a9136ad8-d185-4c7b-9969-057b65dc9b00';
  const jpRef1 = buildJourneyPatternRefDeep(jp1, {
    journeyPatternRefBase: { type_of_line: 'stopping_bus_service' },
    stopBase: {},
    stopLabels,
  });

  // route 641, direction 2
  const jp2 = '4f80b9c2-21b2-4460-9e38-0d0691b29cbe';
  const jpRef2 = buildJourneyPatternRefDeep(jp2, {
    journeyPatternRefBase: { type_of_line: 'stopping_bus_service' },
    stopBase: {},
    stopLabels: reverse(stopLabels),
  });

  const blockBase = {
    vehicle_type_id: vehicleTypes[0].vehicle_type_id,
  };

  // basic priority, long timeframe, Monday-Sunday, route 641 back and forth
  const vsf1 = buildVehicleScheduleFrameDeep({
    vehicleScheduleFrameBase: {
      label: '641 basic',
      priority: Priority.Standard,
      validity_start: DateTime.now().startOf('year'),
      validity_end: DateTime.now().endOf('year'),
    },
    vehicleServiceByDayType: {
      [MON_FRI_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        journeyPatternRefList: [jpRef1, jpRef2],
        startTime: Duration.fromISO('PT5H15M'),
        hastusStopLabels,
        blockBase,
      },
      [SAT_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        startTime: Duration.fromISO('PT4H45M'),
        vehicleServiceCount: { min: 4, max: 6 }, // less buses ride today
        journeyPatternRefList: [jpRef1, jpRef2],
        hastusStopLabels,
        blockBase,
      },
      [SUN_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        startTime: Duration.fromISO('PT8H15M'), // first bus departs late
        vehicleServiceCount: { min: 4, max: 6 }, // less buses ride today
        journeyPatternRefList: [jpRef1, jpRef2],
        hastusStopLabels,
        blockBase,
      },
    },
  });

  // temporary priority, short timeframe, Saturday only, route 641 back and forth
  const vsf2 = buildVehicleScheduleFrameDeep({
    vehicleScheduleFrameBase: {
      label: '641 temporary',
      priority: Priority.Temporary,
      validity_start: DateTime.now().startOf('month'),
      validity_end: DateTime.now().endOf('month'),
    },
    vehicleServiceByDayType: {
      [SAT_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        startTime: Duration.fromISO('PT4H45M'),
        vehicleServiceCount: { min: 14, max: 16 }, // more buses ride today
        journeyPatternRefList: [jpRef1, jpRef2],
        hastusStopLabels,
        blockBase,
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
