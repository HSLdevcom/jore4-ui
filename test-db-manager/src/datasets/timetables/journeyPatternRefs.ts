import { DateTime } from 'luxon';
import { JourneyPatternRefInsertInput } from '../../types';

export const seedJourneyPatternRefs: JourneyPatternRefInsertInput[] = [
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
  },
  {
    // route 641, direction 2
    journey_pattern_ref_id: '4f80b9c2-21b2-4460-9e38-0d0691b29cbe',
    // NOTE: same comments for journey_pattern with id
    // '4f80b9c2-21b2-4460-9e38-0d0691b29cbe' as stated above
    journey_pattern_id: '4f80b9c2-21b2-4460-9e38-0d0691b29cbe',
    observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
    snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
  },
  {
    // Route 65x variant 3, outbound.
    // NOTE: the journey pattern is defined in hasura seed data.
    journey_pattern_ref_id: '8b4586f1-6cc0-49ab-b30b-442fff9cbef4',
    journey_pattern_id: '2b7fa547-6eb5-4878-8053-6bbd6e9cbfc0',
    observation_timestamp: DateTime.fromISO('2023-07-01T00:00:00+00:00'),
    snapshot_timestamp: DateTime.fromISO('2023-09-28T00:00:00+00:00'),
  },
];
