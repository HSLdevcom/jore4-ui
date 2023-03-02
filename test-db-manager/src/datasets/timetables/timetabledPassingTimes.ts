import { Duration } from 'luxon';
import {
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
} from '../../types';
import { multiplyDuration } from '../../utils';
import { seedJourneyPatternRefs } from './journeyPatternRefs';
import {
  seedStopsInJourneyPatternRefs,
  seedStopsInJourneyPatternRefsByJourneyPattern,
} from './stopsInJourneyPatternRefs';
import { seedVehicleJourneys } from './vehicleJourneys';

interface TimetabledPassingTimesForJourney {
  vehicleJourneyId: UUID;
  scheduledStopLabels?: string[];
  journeyStartTime: Duration; // when does journey start
  stopInterval?: Duration; // how long it takes to drive from stop to another
  waitTimeOnStops?: Duration; // how long vehicle stays on stop
}

const DIRECTION1_STOP_LABELS = seedStopsInJourneyPatternRefsByJourneyPattern[
  seedJourneyPatternRefs[0].journey_pattern_ref_id
].map((item) => item.scheduled_stop_point_label);
const DIRECTION2_STOP_LABELS = seedStopsInJourneyPatternRefsByJourneyPattern[
  seedJourneyPatternRefs[1].journey_pattern_ref_id
].map((item) => item.scheduled_stop_point_label);

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
  scheduledStopLabels = DIRECTION1_STOP_LABELS,
  journeyStartTime,
  stopInterval = Duration.fromISO('PT5M'),
  waitTimeOnStops = Duration.fromISO('PT0M'),
}: TimetabledPassingTimesForJourney): TimetabledPassingTimeInsertInput[] => {
  const passingTimes = [];
  let currentTime = journeyStartTime; // Keep track of progress between loops.
  scheduledStopLabels.forEach((item, index) => {
    const arrivalTime: Duration = currentTime;
    const departureTime = currentTime.plus({
      minutes: waitTimeOnStops.as('minutes'),
    });
    currentTime = departureTime.plus({ minutes: stopInterval.as('minutes') });

    passingTimes.push(
      buildTimetabledPassingTime({
        vehicleJourneyId,
        stopInJourneyPatternRefId: findStopIdByLabel(item),
        arrivalTime: index === 0 ? null : arrivalTime,
        departureTime:
          index === scheduledStopLabels.length - 1 ? null : departureTime,
      }),
    );
  });

  return passingTimes;
};

const buildBulkJourneys = ({
  vehicleJourneyIds,
  blockStartTime,
  scheduledStopLabels,
  journeyInterval = Duration.fromISO('PT5M'),
}: {
  vehicleJourneyIds: UUID[];
  blockStartTime: Duration;
  scheduledStopLabels: string[];
  journeyInterval?: Duration;
}): TimetabledPassingTimeInsertInput[] => {
  return vehicleJourneyIds.flatMap((item, index) => {
    const durationFromStart = multiplyDuration(journeyInterval, index + 1);
    return buildTimetabledPassingTimesForJourney({
      vehicleJourneyId: item,
      journeyStartTime: blockStartTime.plus(durationFromStart),
      scheduledStopLabels,
    });
  });
};

const journey1Id = seedVehicleJourneys[0].vehicle_journey_id;

const seedVehicleJourneyIds = seedVehicleJourneys.map(
  (item) => item.vehicle_journey_id,
);

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
    arrival_time: Duration.fromISO('PT7H38M'),
    departure_time: Duration.fromISO('PT7H38M'),
  },
  {
    vehicle_journey_id: journey1Id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H2206'),
    arrival_time: Duration.fromISO('PT7H48M'),
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
    journeyStartTime: Duration.fromISO('PT7H29M'),
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
  // journeys 7-19
  ...buildBulkJourneys({
    vehicleJourneyIds: seedVehicleJourneyIds.slice(7, 20),
    blockStartTime: Duration.fromISO('PT7H18M'),
    journeyInterval: Duration.fromISO('PT2M'),
    scheduledStopLabels: DIRECTION1_STOP_LABELS,
  }),
  // journeys 20-24, opposite direction
  ...buildBulkJourneys({
    vehicleJourneyIds: seedVehicleJourneyIds.slice(20, 25),
    blockStartTime: Duration.fromISO('PT7H18M'),
    scheduledStopLabels: DIRECTION2_STOP_LABELS,
  }),
];

const seedTimetabledPassingTimesSat: TimetabledPassingTimeInsertInput[] = [
  ...buildBulkJourneys({
    vehicleJourneyIds: seedVehicleJourneyIds.slice(25, 29),
    blockStartTime: Duration.fromISO('PT10H0M'),
    scheduledStopLabels: DIRECTION1_STOP_LABELS,
  }),
];

const seedTimetabledPassingTimesSun: TimetabledPassingTimeInsertInput[] = [
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneys[29].vehicle_journey_id,
    journeyStartTime: Duration.fromISO('PT10H15M'),
    stopInterval: Duration.fromISO('PT15M'),
    scheduledStopLabels: DIRECTION1_STOP_LABELS,
  }),
];

const seedTimetabledPassingTimesDecember23: TimetabledPassingTimeInsertInput[] =
  [
    ...buildBulkJourneys({
      vehicleJourneyIds: seedVehicleJourneyIds.slice(30, 40),
      blockStartTime: Duration.fromISO('PT8H0M'),
      scheduledStopLabels: DIRECTION1_STOP_LABELS,
    }),
  ];

const seedTimetabledPassingTimesHiddenVariantMonFri: TimetabledPassingTimeInsertInput[] =
  [
    {
      vehicle_journey_id: seedVehicleJourneyIds[40],
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H1234'),
      arrival_time: null,
      departure_time: Duration.fromISO('PT10H30M'),
    },
    {
      vehicle_journey_id: seedVehicleJourneyIds[40],
      scheduled_stop_point_in_journey_pattern_ref_id:
        findStopIdByLabel('H1235'),
      arrival_time: Duration.fromISO('PT11H45M'),
      departure_time: null,
    },
  ];

export const seedTimetabledPassingTimes: TimetabledPassingTimeInsertInput[] = [
  ...seedTimetabledPassingTimesMonFri,
  ...seedTimetabledPassingTimesSat,
  ...seedTimetabledPassingTimesSun,
  ...seedTimetabledPassingTimesDecember23,
  ...seedTimetabledPassingTimesHiddenVariantMonFri,
];
