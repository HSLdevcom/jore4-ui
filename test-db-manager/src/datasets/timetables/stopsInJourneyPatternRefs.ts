import padStart from 'lodash/padStart';
import range from 'lodash/range';
import { v4 as uuid } from 'uuid';
import { StopInJourneyPatternRefInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';

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

const journeyPatternRefId0 = seedJourneyPatternRefs[0].journey_pattern_ref_id;
const journeyPatternRefId1 = seedJourneyPatternRefs[1].journey_pattern_ref_id;
const journeyPatternRefId2 = seedJourneyPatternRefs[2].journey_pattern_ref_id;

export const seedStopsInJourneyPatternRefsByJourneyPattern = {
  [journeyPatternRefId0]: buildStopSequence({
    journeyPatternRefId: journeyPatternRefId0,
    labelPrefix: 'H22',
    stopsToCreate: 8,
  }),
  [journeyPatternRefId1]: buildStopSequence({
    journeyPatternRefId: journeyPatternRefId1,
    labelPrefix: 'H23',
    stopsToCreate: 8,
  }),
  [journeyPatternRefId2]: buildStopSequence({
    journeyPatternRefId: journeyPatternRefId2,
    labels: ['H1234', 'H1235'],
    stopsToCreate: 2,
  }),
};

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  Object.values(seedStopsInJourneyPatternRefsByJourneyPattern).flat();
