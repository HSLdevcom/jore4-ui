import groupBy from 'lodash/groupBy';
import padStart from 'lodash/padStart';
import range from 'lodash/range';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  StopInJourneyPatternRefInsertInput,
  JourneyPatternRefInsertInput,
} from '../../types';

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

const processDataset = (dataset: typeof data) => {
  const journeyPatternRefs: JourneyPatternRefInsertInput[] = [];
  const scheduledStopPoints: StopInJourneyPatternRefInsertInput[] = [];

  dataset.forEach((jprWithChildren) => {
    const { stopPoints, ...partialJpr } = jprWithChildren;
    const jpr = {
      journey_pattern_ref_id: uuid(),
      ...partialJpr
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

const data = [
  {
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
  {
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
  {
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
];

const processed = processDataset(data);

export const seedJourneyPatternRefs: JourneyPatternRefInsertInput[] =
  processed.journeyPatternRefs;

export const seedStopsInJourneyPatternRefsByJourneyPattern = groupBy(
  processed.scheduledStopPoints,
  'journey_pattern_ref_id',
);

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  processed.scheduledStopPoints;
