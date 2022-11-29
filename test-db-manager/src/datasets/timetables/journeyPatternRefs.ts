import { DateTime } from 'luxon';
import { JourneyPatternRefInsertInput } from '../../types';

export const seedJourneyPatternRefs: JourneyPatternRefInsertInput[] = [
  {
    journey_pattern_ref_id: 'a6f626c8-e743-4c38-b9c1-c537ffb2863f',
    journey_pattern_id: 'cf056e74-0109-4d29-ad3f-9c3fcdcec482',
    observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
    snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
  },
];
