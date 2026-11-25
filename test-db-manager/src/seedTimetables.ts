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
import { today } from './utils/time';

function vehicleScheduleFrameBase(label: string) {
  return {
    label,
    priority: Priority.Standard,
    validity_start: today().with({ month: 1, day: 1 }),
    validity_end: today().with({ month: 12, day: 31 }),
  };
}

export async function seedTimetables() {
  const outboundStopLabels = [
    'V6128',
    'V6131',
    'V6310',
    'V6326',
    'V6308',
    'V6501',
    'V6503',
    'V6505',
    'V6507',
    'V6509',
    'V7001',
    'V7028',
    'V7030',
    'V7025',
    'V7108',
    'V7118',
    'V7144',
    'V7142',
    'Tu6775',
    'Tu6736',
    'Tu6734',
    'Tu6733',
    'Tu6535',
    'Tu6533',
    'Tu6531',
    'Tu6032',
    'Tu6035',
    'Tu6037',
    'Tu6038',
    'Tu6040',
    'Tu6042',
    'Tu6668',
    'Tu6061',
    'Tu6062',
    'Tu6064',
    'Tu6066',
    'Tu6821',
    'Tu6822',
    'Tu6840',
    'Tu6844',
    'Tu6842',
    'Tu6846',
    'Tu6848',
    'Ke0202',
    'Ke0205',
    'Ke0207',
    'Ke0404',
    'Ke0406',
    'Ke0200',
  ];
  const inboundStopLabels = [
    'Ke0420',
    'Ke0405',
    'Ke0403',
    'Ke0401',
    'Ke0144',
    'Ke0143',
    'Ke0141',
    'Ke0115',
    'Tu6849',
    'Tu6847',
    'Tu6843',
    'Tu6845',
    'Tu6841',
    'Tu6824',
    'Tu6870',
    'Tu6067',
    'Tu6065',
    'Tu6063',
    'Tu6661',
    'Tu6043',
    'Tu6041',
    'Tu6039',
    'Tu6036',
    'Tu6034',
    'Tu6033',
    'Tu6530',
    'Tu6532',
    'Tu6534',
    'Tu1019',
    'Tu6776',
    'Tu6774',
    'V7143',
    'V7139',
    'V7117',
    'V7109',
    'V7027',
    'V7026',
    'V7031',
    'V7029',
    'V7002',
    'V6510',
    'V6508',
    'V6506',
    'V6504',
    'V6502',
    'V6307',
    'V6325',
    'V6309',
    'V6109',
    'V6108',
  ];
  const hastusStopLabels = [
    outboundStopLabels[0],
    outboundStopLabels[4],
    outboundStopLabels[outboundStopLabels.length - 1],
  ];
  const vehicleTypesResult = await getVehicleTypes();

  const vehicleTypes = [
    vehicleTypesResult.data.timetables.timetables_vehicle_type_vehicle_type,
  ];

  // route 641, direction 1
  const jp1 = 'fbde3036-c980-4971-a1d1-85924958b382';
  const jpRef1 = buildJourneyPatternRefDeep(jp1, {
    journeyPatternRefBase: {
      type_of_line: 'stopping_bus_service',
      route_label: '641',
      route_direction: TimetablesRouteDirectionEnum.Outbound,
    },
    stopBase: {},
    stopLabels: outboundStopLabels,
  });

  // route 641, direction 2
  const jp2 = 'aeb4d8b1-1d21-46ff-9400-904af1a4e77f';
  const jpRef2 = buildJourneyPatternRefDeep(jp2, {
    journeyPatternRefBase: {
      type_of_line: 'stopping_bus_service',
      route_label: '641',
      route_direction: TimetablesRouteDirectionEnum.Inbound,
    },
    stopBase: {},
    stopLabels: inboundStopLabels,
  });

  const blockBase = {
    vehicle_type_id: vehicleTypes[0].vehicle_type_id,
  };

  // basic priority, long timeframe, Monday-Sunday, route 641 back and forth
  const vsf1 = buildVehicleScheduleFrameDeep({
    vehicleScheduleFrameBase: vehicleScheduleFrameBase('641 Monday-Friday'),
    vehicleServiceByDayType: {
      [MON_FRI_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        journeyPatternRefList: [jpRef1, jpRef2],
        startTime: Temporal.Duration.from('PT5H15M'),
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
        startTime: Temporal.Duration.from('PT4H45M'),
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
        startTime: Temporal.Duration.from('PT8H15M'), // first bus departs late
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
      validity_start: today().with({ day: 1 }),
      validity_end: today().with({ day: today().daysInMonth }),
    },
    vehicleServiceByDayType: {
      [SAT_DAY_TYPE]: {
        ...defaultVehicleServiceByDayTypeParams,
        startTime: Temporal.Duration.from('PT4H45M'),
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
}
