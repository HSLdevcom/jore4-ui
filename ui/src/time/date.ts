import { now } from './dateTime';

export type DateLike = Temporal.PlainDate | string;

type ValidityPeriod = {
  readonly validity_start?: Temporal.PlainDate | null;
  readonly validity_end?: Temporal.PlainDate | null;
};

export const MIN_DATE = Temporal.PlainDate.from('1970-01-01');
export const MAX_DATE = Temporal.PlainDate.from('2050-12-31');

export function today(): Temporal.PlainDate {
  return now().toPlainDate();
}

export function parseDate(date: DateLike): Temporal.PlainDate;
export function parseDate(date: null | undefined): undefined;
export function parseDate(
  date: DateLike | null | undefined,
): Temporal.PlainDate | undefined;
export function parseDate(date?: DateLike | null) {
  if (!date) {
    return undefined;
  }

  if (date instanceof Temporal.PlainDate) {
    return date;
  }

  return Temporal.PlainDate.from(date);
}

export function tryToParseDate(
  date: DateLike | null | undefined,
): Temporal.PlainDate | undefined {
  try {
    return parseDate(date);
  } catch {
    return undefined;
  }
}

export function mapToISODate(date: DateLike): string;
export function mapToISODate(date: null | undefined): undefined;
export function mapToISODate(
  date: DateLike | null | undefined,
): string | undefined;
export function mapToISODate(date: DateLike | null | undefined) {
  return parseDate(date)?.toString();
}

// Inclusive, a missing start or end means open-ended.
export function isDateInRange(
  date: Temporal.PlainDate,
  startDate: Temporal.PlainDate | null | undefined,
  endDate: Temporal.PlainDate | null | undefined,
) {
  return (
    (!startDate || Temporal.PlainDate.compare(date, startDate) >= 0) &&
    (!endDate || Temporal.PlainDate.compare(date, endDate) <= 0)
  );
}

function startsAtLatestOn(
  start: Temporal.PlainDate | null | undefined,
  end: Temporal.PlainDate | null | undefined,
) {
  return !start || !end || Temporal.PlainDate.compare(start, end) <= 0;
}

// Inclusive, a missing start or end means open-ended.
export function areValidityPeriodsOverlapping(
  entity1: ValidityPeriod,
  entity2: ValidityPeriod,
) {
  return (
    startsAtLatestOn(entity1.validity_start, entity2.validity_end) &&
    startsAtLatestOn(entity2.validity_start, entity1.validity_end)
  );
}

export function findEarliestTime(times: ReadonlyArray<Temporal.PlainDate>) {
  return times.reduce((a, b) =>
    Temporal.PlainDate.compare(a, b) <= 0 ? a : b,
  );
}

export function findLatestTime(times: ReadonlyArray<Temporal.PlainDate>) {
  return times.reduce((a, b) =>
    Temporal.PlainDate.compare(a, b) >= 0 ? a : b,
  );
}
