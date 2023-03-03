import groupBy from 'lodash/groupBy';
import padStart from 'lodash/padStart';
import range from 'lodash/range';
import times from 'lodash/times';
import { DateTime, Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  JourneyPatternRefInsertInput,
  JourneyType,
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
  VehicleJourneyInsertInput,
} from '../../types';
import { multiplyDuration } from '../../utils';
import { seedVehicleServiceBlocksByName } from './vehicleServiceBlocks';

const buildStopInJourneyPatternRef = ({
  id = uuid(),
  journeyPatternRefId,
  label,
  sequenceNumber,
}: {
  id?: UUID;
  journeyPatternRefId: UUID;
  label: string;
  sequenceNumber: number;
}): StopInJourneyPatternRefInsertInput => ({
  scheduled_stop_point_in_journey_pattern_ref_id: id,
  journey_pattern_ref_id: journeyPatternRefId,
  scheduled_stop_point_label: label,
  scheduled_stop_point_sequence: sequenceNumber,
});

const buildStopSequence = ({
  journeyPatternRefId,
  labels,
  labelPrefix,
  stopsToCreate,
}: {
  journeyPatternRefId: UUID;
  labels?: string[]; // Either `labelPrefix` or explicit `labels` should be given.
  labelPrefix?: string;
  stopsToCreate: number;
}): StopInJourneyPatternRefInsertInput[] => {
  const stops: StopInJourneyPatternRefInsertInput[] = [];

  range(0, stopsToCreate).forEach((index) => {
    const label = labels
      ? labels[index]
      : `${labelPrefix}${padStart((index + 1).toString(), 2, '0')}`;

    stops.push(
      buildStopInJourneyPatternRef({
        journeyPatternRefId,
        label,
        sequenceNumber: index,
      }),
    );
  });

  return stops;
};

const monFriBlockId = seedVehicleServiceBlocksByName.v1MonFri.block_id;
const satBlockId = seedVehicleServiceBlocksByName.v1Sat.block_id;
const sunBlockId = seedVehicleServiceBlocksByName.v1Sun.block_id;
const decBlockId = seedVehicleServiceBlocksByName.v1December23.block_id;
const v2MonFriBlockId = seedVehicleServiceBlocksByName.v2MonFri.block_id;

const buildVehicleJourney = ({
  vehicleJourneyId = uuid(),
  journeyPatternRefId,
  blockId = monFriBlockId,
  journeyType = JourneyType.Standard,
  isVehicleTypeMandatory = false,
  isBackupJourney = false,
  isExtraJourney = false,
}: {
  vehicleJourneyId?: UUID;
  journeyPatternRefId: UUID;
  blockId?: UUID;
  isVehicleTypeMandatory?: boolean;
  isBackupJourney?: boolean;
  isExtraJourney?: boolean;
  journeyType?: JourneyType;
}): VehicleJourneyInsertInput => ({
  vehicle_journey_id: vehicleJourneyId,
  journey_pattern_ref_id: journeyPatternRefId,
  block_id: blockId,
  journey_type: journeyType,
  is_vehicle_type_mandatory: isVehicleTypeMandatory,
  is_backup_journey: isBackupJourney,
  is_extra_journey: isExtraJourney,
});

const processDataset = (dataset: typeof data) => {
  const journeyPatternRefs: JourneyPatternRefInsertInput[] = [];
  const scheduledStopPoints: StopInJourneyPatternRefInsertInput[] = [];
  const timetabledPassingTimes: TimetabledPassingTimeInsertInput[] = [];
  const vehicleJourneys: VehicleJourneyInsertInput[] = [];

  // Return dataset in same format, but enriched with generated ids.
  const enrichedJourneyPatternRefs = {};
  const vehicleJourneysByName: Record<string, VehicleJourneyInsertInput[]> = {};

  Object.entries(dataset.journeyPatternRefs).forEach(
    ([jprLabel, jprWithChildren]) => {
      const { stopPoints, ...partialJpr } = jprWithChildren;
      const jpr = {
        journey_pattern_ref_id: uuid(),
        ...partialJpr,
      };
      journeyPatternRefs.push(jpr);

      // TODO: change to object?
      const builtStopPoints = buildStopSequence({
        journeyPatternRefId: jpr.journey_pattern_ref_id,
        ...stopPoints,
      });
      scheduledStopPoints.push(...builtStopPoints);

      enrichedJourneyPatternRefs[jprLabel] = {
        ...jpr,
        stopPoints: builtStopPoints,
      };
    },
  );

  Object.entries(dataset.vehicleJourneysForBlocks).forEach(
    ([vjLabel, partialVj]) => {
      const journeyPatternRef =
        enrichedJourneyPatternRefs[partialVj.journeyPatternRef];
      if (!journeyPatternRef) {
        throw new Error(
          `Journey pattern ref not found with label "${partialVj.journeyPatternRef}" for vehicle journey "${vjLabel}"`,
        );
      }

      const {
        times: vjsToCreate,
        timetabledPassingTimes: childTpts,
        ...vjParams
      } = { times: 1, timetabledPassingTimes: [], ...partialVj };

      const vjs = times(vjsToCreate, (idx) => {
        const vj = buildVehicleJourney({
          ...vjParams,
          journeyPatternRefId: journeyPatternRef.journey_pattern_ref_id,
        });

        // FIXME: remove the idx hackiness.
        const tpts = idx === 0 ? Object.entries(childTpts).map(
          ([stopLabel, partialTpt]) => {
            const stopPoint = journeyPatternRef.stopPoints.find(
              (sp) => sp.scheduled_stop_point_label === stopLabel,
            );
            if (!stopPoint) {
              throw new Error(
                `Stop point ref not found with label "${stopLabel}" from journey pattern ${partialVj.journeyPatternRef}`,
              );
            }
            const tpt = {
              timetabled_passing_time_id: uuid(),
              ...partialTpt,
              scheduled_stop_point_in_journey_pattern_ref_id:
                stopPoint.scheduled_stop_point_in_journey_pattern_ref_id,
              vehicle_journey_id: vj.vehicle_journey_id,
            };

            timetabledPassingTimes.push(tpt);
            return tpt;
          },
        ) : [];

        vehicleJourneys.push(vj);

        return {
          ...vj,
          timetabledPassingTimes: tpts,
        };
      });

      vehicleJourneysByName[vjLabel] = vjs;
    },
  );

  return {
    journeyPatternRefs,
    scheduledStopPoints,
    timetabledPassingTimes,
    vehicleJourneys,
    vehicleJourneysByName,
  };
};

const data = {
  vehicleJourneysForBlocks: {
    // Journeys 1-20, all belong to same journey pattern and service block (Vehicle 1 Mon-Fri)
    v1MonFri_dir1: {
      times: 20,
      journeyPatternRef: 'route641_d1',
      blockId: monFriBlockId,
      // FIXME: needs some more work.
      // This would currently create identical stop points for each VJ here, which is not what we always want.
      timetabledPassingTimes: {
        // journey 1, goes from H2201->H2208. Defined manually to have some "random"
        // variation in stop times etc.
        H2201: {
          arrival_time: null,
          departure_time: Duration.fromISO('PT7H5M'),
        },
        H2202: {
          arrival_time: Duration.fromISO('PT7H10M'),
          departure_time: Duration.fromISO('PT7H12M'),
        },
        H2203: {
          arrival_time: Duration.fromISO('PT7H18M'),
          departure_time: Duration.fromISO('PT7H20M'),
        },
        H2204: {
          arrival_time: Duration.fromISO('PT7H28M'),
          departure_time: Duration.fromISO('PT7H30M'),
        },
        H2205: {
          arrival_time: Duration.fromISO('PT7H38M'),
          departure_time: Duration.fromISO('PT7H38M'),
        },
        H2206: {
          arrival_time: Duration.fromISO('PT7H48M'),
          departure_time: Duration.fromISO('PT7H48M'),
        },
        H2207: {
          arrival_time: Duration.fromISO('PT7H55M'),
          departure_time: Duration.fromISO('PT7H56M'),
        },
        H2208: {
          arrival_time: Duration.fromISO('PT8H12M'),
          departure_time: null,
        },
      },
    },
    // Journeys 21-25, opposite direction (Vehicle 1 Mon-Fri)
    v1MonFri_dir2: {
      times: 5,
      journeyPatternRef: 'route641_d2',
      blockId: monFriBlockId,
    },
    // Journeys 26-29, all belong to same journey pattern and service block (Vehicle 1 Sat)
    v1Sat: {
      times: 4,
      journeyPatternRef: 'route641_d1',
      blockId: satBlockId,
    },
    // journey 30, belongs to service block (Vehicle 1 Sun)
    v1Sun: {
      journeyPatternRef: 'route641_d1',
      blockId: sunBlockId,
    },
    // journeys 31-40 (Vehicle 1 Mon-Fri December 2023, special priority)
    v1December23: {
      times: 10,
      journeyPatternRef: 'route641_d1',
      blockId: decBlockId,
    },
    // Journey 41 for Vehicle 2 Mon-Fri block.
    v2MonFri: {
      journeyPatternRef: 'route65X3_out',
      blockId: v2MonFriBlockId,
    },
  },
  journeyPatternRefs: {
    route641_d1: {
      // route 641, direction 1
      journey_pattern_ref_id: 'a6f626c8-e743-4c38-b9c1-c537ffb2863f',
      // NOTE: journey_pattern with id 'a9136ad8-d185-4c7b-9969-057b65dc9b00'
      // is defined in hasura seed data. It is just used here as an example.
      // This links timetable data to route 641.
      // Anyway, in longer run it might make sense to define related route
      // + line + journey pattern within this seed data, so that we could
      // maintain it more easily + make sure that e.g. stops match to journey
      // pattern.
      journey_pattern_id: 'a9136ad8-d185-4c7b-9969-057b65dc9b00',
      observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
      snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
      stopPoints: {
        labelPrefix: 'H22',
        stopsToCreate: 8,
      },
    },
    route641_d2: {
      // route 641, direction 2
      // NOTE: same comments for journey_pattern with id
      // '4f80b9c2-21b2-4460-9e38-0d0691b29cbe' as stated above
      journey_pattern_id: '4f80b9c2-21b2-4460-9e38-0d0691b29cbe',
      observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
      snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
      stopPoints: {
        labelPrefix: 'H23',
        stopsToCreate: 8,
      },
    },
    route65X3_out: {
      // Route 65x variant 3, outbound.
      // NOTE: the journey pattern is defined in hasura seed data.
      journey_pattern_id: '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0',
      observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
      snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
      stopPoints: {
        labels: ['H1234', 'H1235'],
        stopsToCreate: 2,
      },
    },
  },
};

const processed = processDataset(data);

export const seedJourneyPatternRefs: JourneyPatternRefInsertInput[] =
  processed.journeyPatternRefs;

export const seedStopsInJourneyPatternRefsByJourneyPattern = groupBy(
  processed.scheduledStopPoints,
  'journey_pattern_ref_id',
);

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  processed.scheduledStopPoints;

export const seedVehicleJourneysByName = processed.vehicleJourneysByName;
export const seedVehicleJourneys: VehicleJourneyInsertInput[] = Object.values(
  seedVehicleJourneysByName,
).flat();

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
  );
  if (!stop) {
    throw new Error(`Can't find stop by label "${label}"`);
  }
  return stop.scheduled_stop_point_in_journey_pattern_ref_id;
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

const mapVehicleJourneyIds = (vehicleJourneys: VehicleJourneyInsertInput[]) => {
  return vehicleJourneys.map((vj) => vj.vehicle_journey_id);
};

const datasetTimetabledPassingTimes: TimetabledPassingTimeInsertInput[] = [
  ...processed.timetabledPassingTimes,
];

const seedTimetabledPassingTimesMonFri: TimetabledPassingTimeInsertInput[] = [
  // journey 2, goes from H2201->H2204, waits 2 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId:
      seedVehicleJourneysByName.v1MonFri_dir1[1].vehicle_journey_id,
    scheduledStopLabels: ['H2201', 'H2202', 'H2203', 'H2204'],
    journeyStartTime: Duration.fromISO('PT8H5M'),
    waitTimeOnStops: Duration.fromISO('PT2M'),
  }),
  // journey 3, goes from H2204->H2208, waits 2 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId:
      seedVehicleJourneysByName.v1MonFri_dir1[2].vehicle_journey_id,
    scheduledStopLabels: ['H2204', 'H2205', 'H2206', 'H2207', 'H2208'],
    journeyStartTime: Duration.fromISO('PT7H29M'),
    waitTimeOnStops: Duration.fromISO('PT2M'),
  }),
  // journey 4, goes from H2201->H2208 but misses H2202, H2204, H2206
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId:
      seedVehicleJourneysByName.v1MonFri_dir1[3].vehicle_journey_id,
    scheduledStopLabels: ['H2201', 'H2203', 'H2205', 'H2207', 'H2208'],
    journeyStartTime: Duration.fromISO('PT9H5M'),
    stopInterval: Duration.fromISO('PT10M'),
  }),
  // journey 5, goes through all stops, waits 1 min on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId:
      seedVehicleJourneysByName.v1MonFri_dir1[4].vehicle_journey_id,
    journeyStartTime: Duration.fromISO('PT7H10M'),
    stopInterval: Duration.fromISO('PT12M'),
    waitTimeOnStops: Duration.fromISO('PT1M'),
  }),
  // journey 6, waits 10 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId:
      seedVehicleJourneysByName.v1MonFri_dir1[5].vehicle_journey_id,
    scheduledStopLabels: ['H2201', 'H2202', 'H2203', 'H2207'],
    journeyStartTime: Duration.fromISO('PT7H12M'),
    stopInterval: Duration.fromISO('PT10M'),
  }),
  // journey 7, waits 15 mins on each stop
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId:
      seedVehicleJourneysByName.v1MonFri_dir1[6].vehicle_journey_id,
    journeyStartTime: Duration.fromISO('PT7H15M'),
    stopInterval: Duration.fromISO('PT15M'),
  }),
  // journeys 7-19
  ...buildBulkJourneys({
    vehicleJourneyIds: mapVehicleJourneyIds(
      seedVehicleJourneysByName.v1MonFri_dir1.slice(7, 20),
    ),
    blockStartTime: Duration.fromISO('PT7H18M'),
    journeyInterval: Duration.fromISO('PT2M'),
    scheduledStopLabels: DIRECTION1_STOP_LABELS,
  }),
  // journeys 20-25, opposite direction
  ...buildBulkJourneys({
    vehicleJourneyIds: mapVehicleJourneyIds(
      seedVehicleJourneysByName.v1MonFri_dir2,
    ),
    blockStartTime: Duration.fromISO('PT7H18M'),
    scheduledStopLabels: DIRECTION2_STOP_LABELS,
  }),
];

const seedTimetabledPassingTimesSat: TimetabledPassingTimeInsertInput[] = [
  ...buildBulkJourneys({
    vehicleJourneyIds: mapVehicleJourneyIds(seedVehicleJourneysByName.v1Sat),
    blockStartTime: Duration.fromISO('PT10H0M'),
    scheduledStopLabels: DIRECTION1_STOP_LABELS,
  }),
];

const seedTimetabledPassingTimesSun: TimetabledPassingTimeInsertInput[] = [
  ...buildTimetabledPassingTimesForJourney({
    vehicleJourneyId: seedVehicleJourneysByName.v1Sun[0].vehicle_journey_id,
    journeyStartTime: Duration.fromISO('PT10H15M'),
    stopInterval: Duration.fromISO('PT15M'),
    scheduledStopLabels: DIRECTION1_STOP_LABELS,
  }),
];

const seedTimetabledPassingTimesDecember23: TimetabledPassingTimeInsertInput[] =
  [
    ...buildBulkJourneys({
      vehicleJourneyIds: mapVehicleJourneyIds(
        seedVehicleJourneysByName.v1December23,
      ),
      blockStartTime: Duration.fromISO('PT8H0M'),
      scheduledStopLabels: DIRECTION1_STOP_LABELS,
    }),
  ];

const seedTimetabledPassingTimesV2MonFri: TimetabledPassingTimeInsertInput[] = [
  {
    vehicle_journey_id:
      seedVehicleJourneysByName.v2MonFri[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H1234'),
    arrival_time: null,
    departure_time: Duration.fromISO('PT10H30M'),
  },
  {
    vehicle_journey_id:
      seedVehicleJourneysByName.v2MonFri[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id: findStopIdByLabel('H1235'),
    arrival_time: Duration.fromISO('PT11H45M'),
    departure_time: null,
  },
];

export const seedTimetabledPassingTimes: TimetabledPassingTimeInsertInput[] = [
  ...datasetTimetabledPassingTimes,
  ...seedTimetabledPassingTimesMonFri,
  ...seedTimetabledPassingTimesSat,
  ...seedTimetabledPassingTimesSun,
  ...seedTimetabledPassingTimesDecember23,
  ...seedTimetabledPassingTimesV2MonFri,
];
