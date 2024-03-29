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
  label,
  bookingLabel,
  bookingDescription = name,
  priority = TimetablePriority.Standard,
}: {
  id: UUID;
  name: string;
  validityStart: DateTime;
  validityEnd: DateTime;
  label: string;
  bookingLabel: string;
  bookingDescription?: string;
  priority?: TimetablePriority;
}): VehicleScheduleFrameInsertInput => ({
  vehicle_schedule_frame_id: id,
  name_i18n: buildLocalizedString(name),
  validity_start: validityStart,
  validity_end: validityEnd,
  label,
  booking_label: bookingLabel,
  booking_description_i18n: buildLocalizedString(bookingDescription),
  priority,
});

const validityPeriodWinter2324 = {
  name: '2023 Syksy - 2024 Kevät',
  label: '1023',
  bookingLabel: '23SYK',
  validityStart: DateTime.fromISO('2023-08-15T00:00:00+00:00'),
  validityEnd: DateTime.fromISO('2024-06-04T00:00:00+00:00'),
};
const validityPeriodDecember23 = {
  name: 'Joulu 2023',
  label: '2046',
  bookingLabel: '23JOU',
  validityStart: DateTime.fromISO('2023-12-01T00:00:00+00:00'),
  validityEnd: DateTime.fromISO('2023-12-31T00:00:00+00:00'),
};

export const seedVehicleScheduleFramesByName = {
  // winter 2023-2024
  winter2324: buildVehicleScheduleFrame({
    id: '7bdb824f-5461-4049-9668-254e8e3172db',
    ...validityPeriodWinter2324,
  }),
  // December 2023, higher priority
  december23: buildVehicleScheduleFrame({
    id: 'dbe63cd7-689c-40e4-bff1-f25e86206172',
    priority: TimetablePriority.Special,
    ...validityPeriodDecember23,
  }),
};

export const seedVehicleScheduleFrames: VehicleScheduleFrameInsertInput[] =
  Object.values(seedVehicleScheduleFramesByName);
