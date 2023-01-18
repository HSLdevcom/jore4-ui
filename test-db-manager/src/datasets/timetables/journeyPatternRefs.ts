import { DateTime } from 'luxon';
import { JourneyPatternRefInsertInput } from '../../types';

export const seedJourneyPatternRefs: JourneyPatternRefInsertInput[] = [
  {
    // direction 1
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
  {
    // direction 2
    journey_pattern_ref_id: '3d31f8e0-5a46-43c7-9045-ac6a379d02e5',
    // NOTE: same comments for journey_pattern with id
    // '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0' as stated above
    journey_pattern_id: '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0',
    observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
    snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
  },
];
