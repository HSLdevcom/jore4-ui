import { DateTime, Duration } from 'luxon';
import { buildLocalizedString } from '../../builders';
import {
  JourneyPatternRefInsertInput,
  StopInJourneyPatternRefInsertInput,
  TimetabledPassingTimeInsertInput,
  TimetablePriority,
  VehicleJourneyInsertInput,
  VehicleScheduleFrameInsertInput,
  VehicleServiceBlockInsertInput,
  VehicleServiceInsertInput,
} from '../../types';

export const seedJourneyPatternRefs: JourneyPatternRefInsertInput[] = [
  {
    journey_pattern_ref_id: 'a6f626c8-e743-4c38-b9c1-c537ffb2863f',
    journey_pattern_id: 'cf056e74-0109-4d29-ad3f-9c3fcdcec482',
    observation_timestamp: DateTime.fromISO('2023-01-01T00:00:00+00:00'),
    snapshot_timestamp: DateTime.fromISO('2023-01-01T00:00:00+00:00'),
  },
];

export const seedStopsInJourneyPatternRefs: StopInJourneyPatternRefInsertInput[] =
  [
    {
      scheduled_stop_point_in_journey_pattern_ref_id:
        'e3af3052-470a-4588-9cb7-053c86995690',
      journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
      scheduled_stop_point_label: 'H2234',
      scheduled_stop_point_sequence: 1,
    },
  ];

export const seedVehicleScheduleFrames: VehicleScheduleFrameInsertInput[] = [
  {
    vehicle_schedule_frame_id: '7bdb824f-5461-4049-9668-254e8e3172db',
    name_i18n: buildLocalizedString('2022 Syksy - 2022 Kevät'),
    validity_start: DateTime.fromISO('2023-01-01T00:00:00+00:00'),
    validity_end: DateTime.fromISO('2023-01-01T00:00:00+00:00'),
    priority: TimetablePriority.Standard,
  },
];

// TODO: this is populated as sql migration in hasura.
// Maybe rather populate day type here and refer to it.
const TODO_DAY_TYPE_ID = '38853b0d-ec36-4110-b4bc-f53218c6cdcd';

export const seedVehicleServices: VehicleServiceInsertInput[] = [
  {
    vehicle_service_id: '6b8525aa-42dc-455f-8558-132ff1b8ae10',
    day_type_id: TODO_DAY_TYPE_ID,
    vehicle_schedule_frame_id:
      seedVehicleScheduleFrames[0].vehicle_schedule_frame_id,
  },
];

export const seedVehicleServiceBlocks: VehicleServiceBlockInsertInput[] = [
  {
    vehicle_service_id: seedVehicleServices[0].vehicle_service_id,
    block_id: '3ebce471-1ef2-4951-af34-6a9ff0660cb8',
  },
];

export const seedVehicleJourneys: VehicleJourneyInsertInput[] = [
  {
    vehicle_journey_id: '6f1a8bd0-2017-498f-9ad2-d7ff0ffb6001',
    journey_pattern_ref_id: seedJourneyPatternRefs[0].journey_pattern_ref_id,
    block_id: seedVehicleServiceBlocks[0].block_id,
  },
];

export const seedTimetabledPassingTimes: TimetabledPassingTimeInsertInput[] = [
  {
    timetabled_passing_time_id: 'b0f737fb-ef12-4905-99c4-d7c93b52d5b4',
    vehicle_journey_id: seedVehicleJourneys[0].vehicle_journey_id,
    scheduled_stop_point_in_journey_pattern_ref_id:
      seedStopsInJourneyPatternRefs[0]
        .scheduled_stop_point_in_journey_pattern_ref_id,
    arrival_time: null,
    departure_time: Duration.fromISO('PT5H5M'),
  },
];
