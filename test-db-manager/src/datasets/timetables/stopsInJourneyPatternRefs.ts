import padStart from 'lodash/padStart';
import { v4 as uuid } from 'uuid';
import { StopInJourneyPatternRefInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';

const buildStopInJourneyPatternRef = ({
  id,
  journeyPatternRefId,
  label,
  sequenceNumber,
}: {
  id: UUID;
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
  labelPrefix,
  stopsToCreate,
}: {
  journeyPatternRefId: UUID;
  labelPrefix: string;
  stopsToCreate: number;
}): StopInJourneyPatternRefInsertInput[] => {
  const stops: StopInJourneyPatternRefInsertInput[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < stopsToCreate + 1; ++i) {
    const labelPostfix = padStart(i.toString(), 2, '0');
    stops.push(
      buildStopInJourneyPatternRef({
        id: uuid(),
        journeyPatternRefId,
        label: `${labelPrefix}${labelPostfix}`,
        sequenceNumber: i,
      }),
    );
  }
  return stops;
};

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  [
    ...buildStopSequence({
      journeyPatternRefId: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      labelPrefix: 'H22',
      stopsToCreate: 8,
    }),
  ];
