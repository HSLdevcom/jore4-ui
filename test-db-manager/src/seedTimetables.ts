import reverse from 'lodash/reverse';
import { DateTime, Duration } from 'luxon';
import { buildLabelArray } from './builders/common';
import {
  buildJourneyPatternRefDeep,
  buildVehicleScheduleFrameDeep,
  defaultVehicleServiceByDayTypeParams,
} from './builders/timetables';
import { MON_FRI_DAY_TYPE, SAT_DAY_TYPE, SUN_DAY_TYPE } from './datasets';
import {
  flattenJourneyPatternRef,
  flattenVehicleScheduleFrame,
  mergeTimetablesResources,
  populateTimetablesDb,
} from './db-helpers';
import { TimetablesRouteDirectionEnum } from './generated/graphql';
import { getVehicleTypes } from './queries';
import { Priority } from './types';

export const seedTimetables = async () => {
  const stopLabels = buildLabelArray('H22', 10);
  const hastusStopLabels = [stopLabels[0], stopLabels[4], stopLabels[9]];
  const vehicleTypesResult = await getVehicleTypes();

  const vehicleTypes = [
    vehicleTypesResult.data.timetables.timetables_vehicle_type_vehicle_type,
  ];

  // route 641, direction 1
  const jp1 = '0a4b3229-f57e-4d5c-b07a-fa40d960ffb2';
  const jpRef1 = buildJourneyPatternRefDeep(jp1, {
    journeyPatternRefBase: {
      type_of_line: 'stopping_bus_service',
      route_label: '641',
      route_direction: TimetablesRouteDirectionEnum.Outbound,
    },
    stopBase: {},
    stopLabels,
  });

  // route 641, direction 2
  const jp2 = '2f65bef2-c056-4852-bfd6-1c248580051b';
  const jpRef2 = buildJourneyPatternRefDeep(jp2, {
    journeyPatternRefBase: {
      type_of_line: 'stopping_bus_service',
      route_label: '641',
      route_direction: TimetablesRouteDirectionEnum.Outbound,
    },
    stopBase: {},
    stopLabels: reverse(stopLabels),
  });

  const blockBase = {
    vehicle_type_id: vehicleTypes[0].vehicle_type_id,
  };

  const vehicleScheduleFrameBase = (label: string) => ({
    label,
    priority: Priority.Standard,
    validity_start: DateTime.now().startOf('year'),
    validity_end: DateTime.now().endOf('year'),
  });

  // basic priority, long timeframe, Monday-Sunday, route 641 back and forth
  const vsf1 = buildVehicleScheduleFrameDeep({
    vehicleScheduleFrameBase: vehicleScheduleFrameBase('641 Monday-Friday'),
    vehicleServiceByDayType: {
      [MON_FRI_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        journeyPatternRefList: [jpRef1, jpRef2],
        startTime: Duration.fromISO('PT5H15M'),
        hastusStopLabels,
        blockBase,
      },
    },
  });

  const vsf2 = buildVehicleScheduleFrameDeep({
    vehicleScheduleFrameBase: vehicleScheduleFrameBase('641 Saturday'),
    vehicleServiceByDayType: {
      [SAT_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        startTime: Duration.fromISO('PT4H45M'),
        vehicleServiceCount: { min: 4, max: 6 }, // less buses ride today
        journeyPatternRefList: [jpRef1, jpRef2],
        hastusStopLabels,
        blockBase,
      },
    },
  });

  const vsf3 = buildVehicleScheduleFrameDeep({
    vehicleScheduleFrameBase: vehicleScheduleFrameBase('641 Sunday'),
    vehicleServiceByDayType: {
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
  const vsf4 = buildVehicleScheduleFrameDeep({
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
    flattenVehicleScheduleFrame(vsf3),
    flattenVehicleScheduleFrame(vsf4),
  ]);

  await populateTimetablesDb(timetablesResources);
};
