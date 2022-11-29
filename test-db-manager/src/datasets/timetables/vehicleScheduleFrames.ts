import { DateTime } from 'luxon';
import { buildLocalizedString } from '../../builders';
import {
  TimetablePriority,
  VehicleScheduleFrameInsertInput,
} from '../../types';

export const seedVehicleScheduleFrames: VehicleScheduleFrameInsertInput[] = [
  // basic case
  {
    vehicle_schedule_frame_id: '7bdb824f-5461-4049-9668-254e8e3172db',
    name_i18n: buildLocalizedString('2023 Syksy - 2024 Kevät'),
    validity_start: DateTime.fromISO('2023-08-15T00:00:00+00:00'),
    validity_end: DateTime.fromISO('2024-06-04T00:00:00+00:00'),
    priority: TimetablePriority.Standard,
  },
  // single day type, standard priority
  {
    vehicle_schedule_frame_id: '06ccb63d-a8dc-4020-a569-4d83f61a6cdb',
    name_i18n: buildLocalizedString('2023 Syksy - 2024 Kevät'),
    validity_start: DateTime.fromISO('2023-08-15T00:00:00+00:00'),
    validity_end: DateTime.fromISO('2024-06-04T00:00:00+00:00'),
    priority: TimetablePriority.Standard,
  },
  // single day type, higher priority
  {
    vehicle_schedule_frame_id: 'de793c02-cea8-4956-8b50-1c3db2806402',
    name_i18n: buildLocalizedString('2023 Syksy - 2024 Kevät'),
    validity_start: DateTime.fromISO('2023-08-15T00:00:00+00:00'),
    validity_end: DateTime.fromISO('2024-06-04T00:00:00+00:00'),
    priority: TimetablePriority.Special,
  },
  // mon-sun, standard priority
  {
    vehicle_schedule_frame_id: '580ab4e0-817a-479e-8a4b-99704ca4904b',
    name_i18n: buildLocalizedString('2023 Syksy - 2024 Kevät'),
    validity_start: DateTime.fromISO('2023-08-15T00:00:00+00:00'),
    validity_end: DateTime.fromISO('2024-06-04T00:00:00+00:00'),
    priority: TimetablePriority.Standard,
  },
  // mon-sun, higher priority
  {
    vehicle_schedule_frame_id: '77c0c8c5-8d78-43ec-b0d2-561f0be11635',
    name_i18n: buildLocalizedString('2023 Syksy - 2024 Kevät'),
    validity_start: DateTime.fromISO('2023-08-15T00:00:00+00:00'),
    validity_end: DateTime.fromISO('2024-06-04T00:00:00+00:00'),
    priority: TimetablePriority.Special,
  },
];
