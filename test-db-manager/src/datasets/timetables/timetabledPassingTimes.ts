import { Duration } from 'luxon';
import {
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
} from '../../types';
import { multiplyDuration } from '../../utils';
import { seedStopsInJourneyPatternRefs } from './stopsInJourneyPatternRefs';
import { seedVehicleJourneys } from './vehicleJourneys';

interface TimetabledPassingTimesForJourney {
  vehicleJourneyId: UUID;
  scheduledStopLabels?: string[];
  journeyStartTime: Duration; // when does journey start
  stopInterval?: Duration; // how long it takes to drive from stop to another
  waitTimeOnStops?: Duration; // how long vehicle stays on stop
}

const ALL_STOP_LABELS = seedStopsInJourneyPatternRefs.map(
  (item) => item.scheduled_stop_point_label,
);

const findStopIdByLabel = (
  label: string,
  knownStops: StopInJourneyPatternRefInsertInput[] = seedStopsInJourneyPatternRefs,
) => {
  const stop = knownStops.find(
    (item) => item.scheduled_stop_point_label === label,
  ).scheduled_stop_point_in_journey_pattern_ref_id;
  if (!stop) {
    throw new Error(`Can't find stop by label "${label}"`);
  }
  return stop;
};

const buildTimetabledPassingTime = (params: {
  vehicleJourneyId: UUID;
  stopInJourneyPatternRefId: UUID;
  arrivalTime: Duration;
  departureTime: Duration;
}): TimetabledPassingTimeInsertInput => ({
  vehicle_journey_id: params.vehicleJourneyId,
  scheduled_stop_point_in_journey_pattern_ref_id:
    params.stopInJourneyPatternRefId,
  arrival_time: params.arrivalTime,
  departure_time: params.departureTime,
});

const buildTimetabledPassingTimesForJourney = ({
  vehicleJourneyId,
  scheduledStopLabels = ALL_STOP_LABELS,
  journeyStartTime,
  stopInterval = Duration.fromISO('PT5M'),
  waitTimeOnStops = Duration.fromISO('PT0M'),
}: TimetabledPassingTimesForJourney): TimetabledPassingTimeInsertInput[] => {
  let arrivalTime: Duration = null;
  let departureTime: Duration = journeyStartTime;
  const passingTimes = [];
  scheduledStopLabels.forEach((item, index) => {
    passingTimes.push(
      buildTimetabledPassingTime({
        vehicleJourneyId,
        stopInJourneyPatternRefId: findStopIdByLabel(item),
        // arrival time is set to null if is it same as departure time
        arrivalTime: arrivalTime?.equals(departureTime) ? null : arrivalTime,
        departureTime,
      }),
    );
    arrivalTime = departureTime.plus(stopInterval);
    departureTime =
      index === scheduledStopLabels.length - 1
        ? null
        : arrivalTime.plus(waitTimeOnStops);
  });
  return passingTimes;
};

const buildBulkJourneys = ({
  vehicleJourneyIds,
  blockStartTime,
  journeyInterval = Duration.fromISO('PT5M'),
}: {
  vehicleJourneyIds: UUID[];
  blockStartTime: Duration;
  journeyInterval?: Duration;
}): TimetabledPassingTimeInsertInput[] => {
  return vehicleJourneyIds.flatMap((item, index) => {
    const durationFromStart = multiplyDuration(journeyInterval, index + 1);
    return buildTimetabledPassingTimesForJourney({
      vehicleJourneyId: item,
      journeyStartTime: blockStartTime.plus(durationFromStart),
    });
  });
};

const journey1Id = seedVehicleJourneys[0].vehicle_journey_id;

const seedTimetabledPassingTimesMonFri: TimetabledPassingTimeInsertInput[] = [
  // journey 1, goes from H2201->H2208. Defined manually to have some "random"
  // variation in stop times etc.
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2201'),
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H5M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2202'),
    arrival_time: Duration.fromISO('PT7H10M'),
    departure_time: Duration.fromISO('PT7H12M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2203'),
    arrival_time: Duration.fromISO('PT7H18M'),
    departure_time: Duration.fromISO('PT7H20M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2204'),
    arrival_time: Duration.fromISO('PT7H28M'),
    departure_time: Duration.fromISO('PT7H30M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2205'),
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H38M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2206'),
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H48M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2207'),
    arrival_time: Duration.fromISO('PT7H55M'),
    departure_time: Duration.fromISO('PT7H56M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2208'),
    arrival_time: Duration.fromISO('PT8H12M'),
    departure_time: null,
  },
  // journey 2, goes from H2201->H2204, waits 2 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[1].vehicle_journey_id,
    scheduledStopLabels: ['H2201', 'H2202', 'H2203', 'H2204'],
    journeyStartTime: Duration.fromISO('PT8H5M'),
    waitTimeOnStops: Duration.fromISO('PT2M'),
  }),
  // journey 3, goes from H2204->H2208, waits 2 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[2].vehicle_journey_id,
    scheduledStopLabels: ['H2204', 'H2205', 'H2206', 'H2207', 'H2208'],
    journeyStartTime: Duration.fromISO('PT7H38M'),
    waitTimeOnStops: Duration.fromISO('PT2M'),
  }),
  // journey 4, goes from H2201->H2208 but misses H2202, H2204, H2206
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[3].vehicle_journey_id,
    scheduledStopLabels: ['H2201', 'H2203', 'H2205', 'H2207', 'H2208'],
    journeyStartTime: Duration.fromISO('PT9H5M'),
    stopInterval: Duration.fromISO('PT10M'),
  }),
  // journey 5, goes through all stops, waits 1 min on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[4].vehicle_journey_id,
    journeyStartTime: Duration.fromISO('PT7H10M'),
    stopInterval: Duration.fromISO('PT12M'),
    waitTimeOnStops: Duration.fromISO('PT1M'),
  }),
  // journey 6, waits 10 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[5].vehicle_journey_id,
    scheduledStopLabels: ['H2201', 'H2202', 'H2203', 'H2207'],
    journeyStartTime: Duration.fromISO('PT7H12M'),
    stopInterval: Duration.fromISO('PT10M'),
  }),
  // journey 7, waits 15 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[6].vehicle_journey_id,
    journeyStartTime: Duration.fromISO('PT7H15M'),
    stopInterval: Duration.fromISO('PT15M'),
  }),
  ...buildBulkJourneys({
    vehicleJourneyIds: [
      seedVehicleJourneys[7].vehicle_journey_id,
      seedVehicleJourneys[8].vehicle_journey_id,
      seedVehicleJourneys[9].vehicle_journey_id,
      seedVehicleJourneys[10].vehicle_journey_id,
      seedVehicleJourneys[11].vehicle_journey_id,
      seedVehicleJourneys[12].vehicle_journey_id,
      seedVehicleJourneys[13].vehicle_journey_id,
      seedVehicleJourneys[14].vehicle_journey_id,
      seedVehicleJourneys[15].vehicle_journey_id,
      seedVehicleJourneys[16].vehicle_journey_id,
      seedVehicleJourneys[17].vehicle_journey_id,
      seedVehicleJourneys[18].vehicle_journey_id,
      seedVehicleJourneys[19].vehicle_journey_id,
    ],
    blockStartTime: Duration.fromISO('PT7H18M'),
    journeyInterval: Duration.fromISO('PT2M'),
  }),
];

const seedTimetabledPassingTimesSat: TimetabledPassingTimeInsertInput[] = [
  ...buildBulkJourneys({
    vehicleJourneyIds: [
      seedVehicleJourneys[20].vehicle_journey_id,
      seedVehicleJourneys[21].vehicle_journey_id,
      seedVehicleJourneys[22].vehicle_journey_id,
      seedVehicleJourneys[23].vehicle_journey_id,
    ],
    blockStartTime: Duration.fromISO('PT10H0M'),
  }),
];

const seedTimetabledPassingTimesSun: TimetabledPassingTimeInsertInput[] = [
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[24].vehicle_journey_id,
    journeyStartTime: Duration.fromISO('PT10H15M'),
    stopInterval: Duration.fromISO('PT15M'),
  }),
];

export const seedImportedTimetabledPassingTimes: TimetabledPassingTimeInsertInput[] =
  [
    // Imported vehicle journeys
    {
      vehicle_journey_id: seedVehicleJourneys[25].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2201'),
      arrival_time: null,
      departure_time: Duration.fromISO('PT7H5M'),
      timetabled_passing_time_id: '7105b9f4-6117-4c88-8b0f-136200045702',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[25].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2202'),
      arrival_time: Duration.fromISO('PT7H10M'),
      departure_time: Duration.fromISO('PT7H12M'),
      timetabled_passing_time_id: '47751209-d3de-42fd-abc0-b37f8028e4f5',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[25].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2203'),
      arrival_time: Duration.fromISO('PT7H18M'),
      departure_time: Duration.fromISO('PT7H20M'),
      timetabled_passing_time_id: 'e462023e-8034-4d74-a766-1eb3262ba1e3',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[26].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2204'),
      arrival_time: Duration.fromISO('PT7H28M'),
      departure_time: Duration.fromISO('PT7H30M'),
      timetabled_passing_time_id: 'e6f692c3-ad92-4c1f-92fe-729c136d829e',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[26].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2205'),
      arrival_time: null,
      departure_time: Duration.fromISO('PT7H38M'),
      timetabled_passing_time_id: 'b6a89ecd-16a6-4333-b549-da3afca8c51d',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[26].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2206'),
      arrival_time: null,
      departure_time: Duration.fromISO('PT7H48M'),
      timetabled_passing_time_id: '96e9ae37-25ea-46b7-866a-33bbafd93ba3',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[27].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2207'),
      arrival_time: Duration.fromISO('PT7H55M'),
      departure_time: Duration.fromISO('PT7H56M'),
      timetabled_passing_time_id: '8b774785-2496-4e3b-a7fc-5f2edf16e370',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[27].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2208'),
      arrival_time: Duration.fromISO('PT8H12M'),
      departure_time: null,
      timetabled_passing_time_id: 'fc46cd09-645e-47a4-b651-346fb9d96280',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[28].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2207'),
      arrival_time: Duration.fromISO('PT7H55M'),
      departure_time: Duration.fromISO('PT7H56M'),
      timetabled_passing_time_id: '83e021a7-c22c-4eff-8a3c-0ced1556a2ae',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[28].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2208'),
      arrival_time: Duration.fromISO('PT8H12M'),
      departure_time: null,
      timetabled_passing_time_id: '23950773-c336-4db0-8654-444dea0a7b27',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[29].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2206'),
      arrival_time: null,
      departure_time: Duration.fromISO('PT7H48M'),
      timetabled_passing_time_id: '4b048368-0a56-4610-9ff3-9d2b19d3ca7f',
    },
    {
      vehicle_journey_id: seedVehicleJourneys[29].vehicle_journey_id,
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H2207'),
      arrival_time: Duration.fromISO('PT7H55M'),
      departure_time: Duration.fromISO('PT7H56M'),
      timetabled_passing_time_id: '1057dfbf-c857-4114-a41e-0f140f5d6c62',
    },
  ];

export const seedTimetabledPassingTimes: TimetabledPassingTimeInsertInput[] = [
  ...seedTimetabledPassingTimesMonFri,
  ...seedTimetabledPassingTimesSat,
  ...seedTimetabledPassingTimesSun,
  ...seedImportedTimetabledPassingTimes,
];
