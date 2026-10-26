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
  validityStart: Temporal.PlainDate;
  validityEnd: Temporal.PlainDate;
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
  validityStart: Temporal.PlainDate.from('2023-08-15'),
  validityEnd: Temporal.PlainDate.from('2024-06-04'),
};
const validityPeriodDecember23 = {
  name: 'Joulu 2023',
  label: '2046',
  bookingLabel: '23JOU',
  validityStart: Temporal.PlainDate.from('2023-12-01'),
  validityEnd: Temporal.PlainDate.from('2023-12-31'),
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
