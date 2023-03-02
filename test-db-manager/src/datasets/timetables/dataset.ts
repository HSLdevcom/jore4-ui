import groupBy from 'lodash/groupBy';
import padStart from 'lodash/padStart';
import range from 'lodash/range';
import times from 'lodash/times';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  JourneyPatternRefInsertInput,
  JourneyType,
  StopInJourneyPatternRefInsertInput,
  VehicleJourneyInsertInput,
} from '../../types';
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
  vehicleJourneyId,
  journeyPatternRefId,
  blockId = monFriBlockId,
  journeyType = JourneyType.Standard,
  isVehicleTypeMandatory = false,
  isBackupJourney = false,
  isExtraJourney = false,
}: {
  vehicleJourneyId: UUID;
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

  Object.values(dataset.journeyPatternRefs).forEach((jprWithChildren) => {
    const { stopPoints, ...partialJpr } = jprWithChildren;
    const jpr = {
      journey_pattern_ref_id: uuid(),
      ...partialJpr,
    };
    journeyPatternRefs.push(jpr);

    const builtStopPoints = buildStopSequence({
      journeyPatternRefId: jpr.journey_pattern_ref_id,
      ...stopPoints,
    });
    scheduledStopPoints.push(...builtStopPoints);
  });

  return {
    journeyPatternRefs,
    scheduledStopPoints,
  };
};

const data = {
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

export const seedVehicleJourneys: VehicleJourneyInsertInput[] = [
  // Journeys 1-20, all belong to same journey pattern and service block (Vehicle 1 Mon-Fri)
  ...times(20, () =>
    buildVehicleJourney({
      journeyPatternRefId: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      vehicleJourneyId: uuid(),
    }),
  ),
  // Journeys 21-25, opposite direction (Vehicle 1 Mon-Fri)
  ...times(5, () =>
    buildVehicleJourney({
      vehicleJourneyId: uuid(),
      journeyPatternRefId: seedJourneyPatternRefs[1].journey_pattern_ref_id,
    }),
  ),
  // Journeys 26-29, all belong to same journey pattern and service block (Vehicle 1 Sat)
  ...times(4, () =>
    buildVehicleJourney({
      journeyPatternRefId: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      vehicleJourneyId: uuid(),
      blockId: satBlockId,
    }),
  ),
  // journey 30, belongs to service block (Vehicle 1 Sun)
  buildVehicleJourney({
    journeyPatternRefId: seedJourneyPatternRefs[0].journey_pattern_ref_id,
    vehicleJourneyId: uuid(),
    blockId: sunBlockId,
  }),
  // journeys 31-40 (Vehicle 1 Mon-Fri December 2023, special priority)
  ...times(10, () =>
    buildVehicleJourney({
      journeyPatternRefId: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      vehicleJourneyId: uuid(),
      blockId: decBlockId,
    }),
  ),
  // Journey 41 for Vehicle 2 Mon-Fri block.
  buildVehicleJourney({
    vehicleJourneyId: uuid(),
    journeyPatternRefId: seedJourneyPatternRefs[2].journey_pattern_ref_id,
    blockId: v2MonFriBlockId,
  }),
];
