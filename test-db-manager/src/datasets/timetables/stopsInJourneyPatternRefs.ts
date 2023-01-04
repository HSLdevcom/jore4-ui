import padStart from 'lodash/padStart';
import range from 'lodash/range';
import { v4 as uuid } from 'uuid';
import { StopInJourneyPatternRefInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';

const ids = [
  'cc73b7dc-6a17-4779-9f97-f27f1ae25fdb',
  'e0852edf-939f-4145-a459-a8625f5dcdba',
  '8272a746-0519-456c-9db2-0ec5a56f20d4',
  '2f9bdd3e-8297-4dfd-81b7-7fac761b85cc',
  '1c3f9614-14c6-4606-bfe3-9e3ca9ba330e',
  'c36e0e0c-d224-4f53-bd1a-753d1b4bc670',
  'db7be353-cd73-40e4-aa81-e66d673f4aac',
  '3ca2cd41-bb19-4a41-9044-d01f8079385b',
];

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
        id: labelPrefix === 'H22' ? ids[index - 1] : uuid(),
      }),
    );
  });

  return stops;
};

const journeyPatternRefId0 = seedJourneyPatternRefs[0].journey_pattern_ref_id;
const journeyPatternRefId1 = seedJourneyPatternRefs[1].journey_pattern_ref_id;

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
};

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  Object.values(seedStopsInJourneyPatternRefsByJourneyPattern).flat();
