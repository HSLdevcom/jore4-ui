import { Duration } from 'luxon';
import { TimetabledPassingTimeInsertInput } from '../../types';
import { seedStopsInJourneyPatternRefs } from './stopsInJourneyPatternRefs';
import { seedVehicleJourneys } from './vehicleJourneys';

export const seedTimetabledPassingTimes: TimetabledPassingTimeInsertInput[] = [
  // journey 1, goes from H2201->H2208
  {
    timetabled_passing_time_id: 'b0f737fb-ef12-4905-99c4-d7c93b52d5b4',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[0]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H5M'),
  },
  {
    timetabled_passing_time_id: 'ebc317a0-6bfd-462f-8c5d-fe01bde05fcc',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[1]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT7H10M'),
    departure_time: Duration.fromISO('PT7H12M'),
  },
  {
    timetabled_passing_time_id: '841a46be-0465-4173-9d0a-565b50dbdb94',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[2]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT7H18M'),
    departure_time: Duration.fromISO('PT7H20M'),
  },
  {
    timetabled_passing_time_id: '28cff770-0b4a-468d-be18-fa252e41b69f',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[3]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT7H28M'),
    departure_time: Duration.fromISO('PT7H30M'),
  },
  {
    timetabled_passing_time_id: '786de875-0254-4012-8abf-468a19f1456e',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[4]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H38M'),
  },
  {
    timetabled_passing_time_id: '1b017b30-3e9e-4226-abd7-9aaab386cba7',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[5]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H48M'),
  },
  {
    timetabled_passing_time_id: '857ac79a-8e93-4e58-8022-29b4e201d1b8',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[6]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT7H55M'),
    departure_time: Duration.fromISO('PT7H56M'),
  },
  {
    timetabled_passing_time_id: '94181906-f24f-418e-8929-502b3c2536dc',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[7]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT8H12M'),
    departure_time: null,
  },
  // journey 2, goes from H2201->H2204
  {
    timetabled_passing_time_id: '57fea50c-1f0f-4dfe-a070-84c7982abe90',
    vehicle_journey_id: seedVehicleJourneys[1].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[0]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT8H5M'),
  },
  {
    timetabled_passing_time_id: '9b0f9cb7-6659-45ea-ade2-a6d40384be6a',
    vehicle_journey_id: seedVehicleJourneys[1].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[1]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT8H10M'),
    departure_time: Duration.fromISO('PT8H12M'),
  },
  {
    timetabled_passing_time_id: '79fec60d-6e06-4765-8a7b-0177a69af185',
    vehicle_journey_id: seedVehicleJourneys[1].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[2]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT8H18M'),
    departure_time: Duration.fromISO('PT8H20M'),
  },
  {
    timetabled_passing_time_id: '584408b5-ff1d-435a-94eb-4662e6dd4d78',
    vehicle_journey_id: seedVehicleJourneys[1].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[3]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT8H28M'),
    departure_time: Duration.fromISO('PT8H30M'),
  },
  // journey 3, goes from H2204->H2208
  {
    timetabled_passing_time_id: 'da306a27-8162-4a91-a427-44f7522c7ba1',
    vehicle_journey_id: seedVehicleJourneys[2].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[4]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H38M'),
  },
  {
    timetabled_passing_time_id: '57982625-9797-4fec-a624-9506cea98dfb',
    vehicle_journey_id: seedVehicleJourneys[2].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[5]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT7H48M'),
  },
  {
    timetabled_passing_time_id: 'f5e6106b-9931-4c28-8a7d-3570a9481675',
    vehicle_journey_id: seedVehicleJourneys[2].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[6]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT7H55M'),
    departure_time: Duration.fromISO('PT7H56M'),
  },
  {
    timetabled_passing_time_id: '93289df6-f4c5-4080-89d2-970cde04eecb',
    vehicle_journey_id: seedVehicleJourneys[2].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[7]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT8H12M'),
    departure_time: null,
  },
  // journey 4, goes from H2201->H2208 but misses H2202, H2204, H2206
  {
    timetabled_passing_time_id: '1dc62801-86d3-498b-a50e-921451f60403',
    vehicle_journey_id: seedVehicleJourneys[3].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[0]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT9H5M'),
  },
  {
    timetabled_passing_time_id: 'c75fb50e-7728-4018-9f71-51d48bf5d996',
    vehicle_journey_id: seedVehicleJourneys[3].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[2]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT9H18M'),
    departure_time: Duration.fromISO('PT9H20M'),
  },
  {
    timetabled_passing_time_id: '5a41fc8a-2136-42fe-a157-383ee9011a90',
    vehicle_journey_id: seedVehicleJourneys[3].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[4]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT9H38M'),
  },
  {
    timetabled_passing_time_id: 'ffa6ed17-eaaa-432c-b24f-ed727d361cd4',
    vehicle_journey_id: seedVehicleJourneys[3].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[6]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT9H55M'),
    departure_time: Duration.fromISO('PT9H56M'),
  },
  {
    timetabled_passing_time_id: '26e947d3-1ec9-4ae5-b57d-1c965d8b6356',
    vehicle_journey_id: seedVehicleJourneys[3].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[7]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: Duration.fromISO('PT10H12M'),
    departure_time: null,
  },
];
