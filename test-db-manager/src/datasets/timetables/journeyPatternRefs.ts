import { DateTime } from 'luxon';
import { JourneyPatternRefInsertInput } from '../../types';

export const seedJourneyPatternRefs: JourneyPatternRefInsertInput[] = [
  {
    journey_pattern_ref_id: 'a6f626c8-e743-4c38-b9c1-c537ffb2863f',
    // NOTE: journey_pattern with id '43e1985d-4643-4415-8367-c4a37fbc0a87'
    // is defined in hasura seed data. It is just used here as an example.
    // Seems like technically this is not validated and we could have any uuid
    // here. Anyway, it might make sense to define also journey pattern
    // in seed data here & refer to it so that it would match journey pattern
    // defined here in timetable dataset.
    journey_pattern_id: '43e1985d-4643-4415-8367-c4a37fbc0a87',
    observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
    snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
  },
];
