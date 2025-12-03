import padStart from 'lodash/padStart';
import range from 'lodash/range';
import { StopInJourneyPatternRefInsertInput } from '../../types';
import { expectValue } from '../../utils';
import { seedJourneyPatternRefs } from './journeyPatternRefs';

const buildLabels = ({
  labelPrefix,
  labelsToCreate,
}: {
  labelPrefix: string;
  labelsToCreate: number;
}): Array<string> => {
  return range(1, labelsToCreate + 1).map((index) => {
    const labelPostfix = padStart(index.toString(), 2, '0');
    return `${labelPrefix}${labelPostfix}`;
  });
};

const buildStopInJourneyPatternRef = ({
  id = crypto.randomUUID(),
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
}: {
  journeyPatternRefId: UUID;
  labels: string[];
}): StopInJourneyPatternRefInsertInput[] => {
  const stops: StopInJourneyPatternRefInsertInput[] = labels.map(
    (label, index) => {
      return buildStopInJourneyPatternRef({
        journeyPatternRefId,
        label,
        sequenceNumber: index + 1,
      });
    },
  );

  return stops;
};

const journeyPatternRefId0 = expectValue(
  seedJourneyPatternRefs[0].journey_pattern_ref_id,
);
const journeyPatternRefId1 = expectValue(
  seedJourneyPatternRefs[1].journey_pattern_ref_id,
);
const journeyPatternRefId2 = expectValue(
  seedJourneyPatternRefs[2].journey_pattern_ref_id,
);

export const seedStopsInJourneyPatternRefsByJourneyPattern = {
  [journeyPatternRefId0]: buildStopSequence({
    journeyPatternRefId: journeyPatternRefId0,
    labels: buildLabels({
      labelPrefix: 'H22',
      labelsToCreate: 8,
    }),
  }),
  [journeyPatternRefId1]: buildStopSequence({
    journeyPatternRefId: journeyPatternRefId1,
    labels: buildLabels({
      labelPrefix: 'H23',
      labelsToCreate: 8,
    }),
  }),
  [journeyPatternRefId2]: buildStopSequence({
    journeyPatternRefId: journeyPatternRefId2,
    labels: ['H1234', 'H1235'],
  }),
};

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  Object.values(seedStopsInJourneyPatternRefsByJourneyPattern).flat();
