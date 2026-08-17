import isString from 'lodash/isString';
import padStart from 'lodash/padStart';
import {
  DateTime,
  Duration,
  FixedOffsetZone,
  IANAZone,
  Interval,
  Settings,
} from 'luxon';
import { ValidityPeriod } from './generated/graphql';

// Use Helsinki as the time default time zone.
const helsinkiTimeZone = IANAZone.create('Europe/Helsinki');
Settings.defaultZone = helsinkiTimeZone;

// Throw instead of returning invalid dates.
Settings.throwOnInvalid = true;
declare module 'luxon' {
  interface TSSettings {
    throwOnInvalid: true;
  }
}

export type DateLike = DateTime | string;

export function isDateLike(input?: unknown): input is DateLike {
  return DateTime.isDateTime(input) || isString(input);
}

function parseActualStringToDateTime(date: string): DateTime {
  if (date.length <= 10) {
    // Set directly to Europe/Helsinki timezone to keep the time at midnight.
    return DateTime.fromISO(date, { zone: helsinkiTimeZone });
  }

  // It is a date & time string.
  return DateTime.fromISO(date, {
    // If no timezone / offset info is specified, assume UTC
    zone: FixedOffsetZone.utcInstance,
  }).setZone(helsinkiTimeZone); // Convert to Helsinki time.
}

export function parseDate(date: DateLike): DateTime;
export function parseDate(date: null | undefined): undefined;
export function parseDate(
  date: DateLike | null | undefined,
): DateTime | undefined;
export function parseDate(date?: DateLike | null) {
  // if null/undefined, return undefined
  if (!date) {
    return undefined;
  }

  // if already DateTime, return as is
  if (DateTime.isDateTime(date)) {
    return date;
  }

  // It is a date string
  return parseActualStringToDateTime(date);
}

export function tryToParseDate(
  date: DateLike | null | undefined,
): DateTime | undefined {
  try {
    return parseDate(date);
  } catch {
    return undefined;
  }
}

// date formats known by luxon: https://moment.github.io/luxon/#/formatting?id=presets
export function formatDateWithLocale(
  format: string,
  locale: string,
  date?: DateLike | null,
): string | undefined {
  return parseDate(date)?.setLocale(locale).toFormat(format);
}

// date formats known by luxon: https://moment.github.io/luxon/#/formatting?id=presets
export function formatDateWithoutLocale(
  format: string,
  date?: DateLike | null,
): string | undefined {
  return parseDate(date)?.toFormat(format);
}

// "shortDate" means format "D.M.YYYY"
export function mapToShortDate(date?: DateLike | null) {
  return formatDateWithoutLocale('d.L.yyyy', date);
}

// "shorTime" means format "H.mm"
export function mapToShortTime(date?: DateLike | null) {
  return formatDateWithoutLocale('H.mm', date);
}

// "shortDateTime" means format "D.M.YYYY H.mm"
export function mapToShortDateTime(date?: DateLike | null) {
  return formatDateWithoutLocale('d.L.yyyy H.mm', date);
}

export function mapToISODate(date: DateLike): string;
export function mapToISODate(date: null | undefined): undefined;
export function mapToISODate(
  date: DateLike | null | undefined,
): string | undefined;
export function mapToISODate(
  date: DateLike | null | undefined,
): string | undefined {
  return parseDate(date)?.toISODate();
}

export const MIN_DATE = DateTime.fromISO('1970-01-01').startOf('day');
export const MAX_DATE = DateTime.fromISO('2050-12-31').endOf('day');

export function isDateInRange(
  date: DateTime,
  startDate: DateTime | null | undefined,
  endDate: DateTime | null | undefined,
) {
  return (!startDate || date >= startDate) && (!endDate || date <= endDate);
}

// The luxon Interval does not handle infinite start/end, so using MIN_DATE and MAX_DATE instead
export function mapValidityPeriodToInterval(entity: ValidityPeriod) {
  return Interval.fromDateTimes(
    entity.validity_start ?? MIN_DATE,
    entity.validity_end ?? MAX_DATE,
  );
}

export function areValidityPeriodsOverlapping(
  entity1: ValidityPeriod,
  entity2: ValidityPeriod,
) {
  return mapValidityPeriodToInterval(entity1).overlaps(
    mapValidityPeriodToInterval(entity2),
  );
}

export function padToTwoDigits(number: number) {
  return padStart(number.toString(), 2, '0');
}

export function mapDurationToShortTime(duration: Duration) {
  return `${padToTwoDigits(duration.hours)}:${padToTwoDigits(duration.minutes)}`;
}

export function findEarliestTime(times: ReadonlyArray<DateTime>) {
  return DateTime.fromMillis(Math.min(...times.map((item) => item.toMillis())));
}

export function findLatestTime(times: ReadonlyArray<DateTime>) {
  return DateTime.fromMillis(Math.max(...times.map((item) => item.toMillis())));
}
