import { DateTime } from 'luxon';

export type DateRange = {
  readonly startDate: DateTime;
  readonly endDate: DateTime;
};
