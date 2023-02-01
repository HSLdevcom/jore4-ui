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
];
