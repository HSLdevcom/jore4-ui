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
  labelPrefix,
  stopsToCreate,
}: {
  journeyPatternRefId: UUID;
  labelPrefix: string;
  stopsToCreate: number;
}): StopInJourneyPatternRefInsertInput[] => {
  const stops: StopInJourneyPatternRefInsertInput[] = [];
  range(1, stopsToCreate + 1).forEach((index) => {
    const labelPostfix = padStart(index.toString(), 2, '0');
    stops.push(
      buildStopInJourneyPatternRef({
        journeyPatternRefId,
        label: `${labelPrefix}${labelPostfix}`,
        sequenceNumber: index,
      }),
    );
  });

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
