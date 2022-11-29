import { StopInJourneyPatternRefInsertInput } from '../../types';
import { seedJourneyPatternRefs } from './journeyPatternRefs';

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  [
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        'e3af3052-470a-4588-9cb7-053c86995690',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2201',
      scheduled_stop_point_sequence: 1,
    },
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        '45a540e3-bc00-4e0a-a983-0e1a1ff1738d',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2202',
      scheduled_stop_point_sequence: 2,
    },
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        'aa32322e-f46d-4d54-a637-69398992538a',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2203',
      scheduled_stop_point_sequence: 3,
    },
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        '3cfc6959-b250-46ad-9731-602a4e6230b3',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2204',
      scheduled_stop_point_sequence: 4,
    },
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        '7e0f9dd7-3267-4147-b17b-b2aadfab502f',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2205',
      scheduled_stop_point_sequence: 5,
    },
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        '2474abd1-75d0-4eb0-9a8d-95fcceb924c8',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2206',
      scheduled_stop_point_sequence: 6,
    },
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        '08d51269-eecd-4bba-92f7-7c7e38bf5216',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2207',
      scheduled_stop_point_sequence: 7,
    },
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        'e50d1df6-d32e-40ff-a069-f2d67e5cd386',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2208',
      scheduled_stop_point_sequence: 8,
    },
  ];
