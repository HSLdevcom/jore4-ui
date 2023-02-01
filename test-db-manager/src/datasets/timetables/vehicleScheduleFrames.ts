import { DateTime } from 'luxon';
import { buildLocalizedString } from '../../builders';
import {
  TimetablePriority,
  VehicleScheduleFrameInsertInput,
} from '../../types';

const buildVehicleScheduleFrame = ({
  id,
  name,
  validityStart,
  validityEnd,
  priority = TimetablePriority.Standard,
}: {
  id: UUID;
  name: string;
  validityStart: DateTime;
  validityEnd: DateTime;
  priority?: TimetablePriority;
}): VehicleScheduleFrameInsertInput => ({
  vehicle_schedule_frame_id: id,
  name_i18n: buildLocalizedString(name),
  validity_start: validityStart,
  validity_end: validityEnd,
  priority,
});

const validityPeriodWinter2324 = {
  name: '2023 Syksy - 2024 Kevät',
  validityStart: DateTime.fromISO('2023-08-15T00:00:00+00:00'),
  validityEnd: DateTime.fromISO('2024-06-04T00:00:00+00:00'),
};

export const seedVehicleScheduleFrames: VehicleScheduleFrameInsertInput[] = [
  // basic case
  buildVehicleScheduleFrame({
    id: '7bdb824f-5461-4049-9668-254e8e3172db',
    ...validityPeriodWinter2324,
  }),
  // single day type, standard priority
  buildVehicleScheduleFrame({
    id: '06ccb63d-a8dc-4020-a569-4d83f61a6cdb',
    ...validityPeriodWinter2324,
  }),
  // single day type, higher priority
  buildVehicleScheduleFrame({
    id: 'de793c02-cea8-4956-8b50-1c3db2806402',
    ...validityPeriodWinter2324,
    priority: TimetablePriority.Special,
  }),
  // mon-sun, standard priority
  buildVehicleScheduleFrame({
    id: '580ab4e0-817a-479e-8a4b-99704ca4904b',
    ...validityPeriodWinter2324,
  }),
  // mon-sun, higher priority
  buildVehicleScheduleFrame({
    id: '77c0c8c5-8d78-43ec-b0d2-561f0be11635',
    ...validityPeriodWinter2324,
    priority: TimetablePriority.Special,
  }),
];
