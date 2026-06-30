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
import { Maybe, ValidityPeriod } from './generated/graphql';

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
export const formatDateWithLocale = (
  format: string,
  locale: string,
  date?: DateLike | null,
): string | undefined => parseDate(date)?.setLocale(locale).toFormat(format);

// date formats known by luxon: https://moment.github.io/luxon/#/formatting?id=presets
export const formatDateWithoutLocale = (
  format: string,
  date?: DateLike | null,
): string | undefined => parseDate(date)?.toFormat(format);

// "shortDate" means format "D.M.YYYY"
export const mapToShortDate = (date?: DateLike | null) =>
  formatDateWithoutLocale('d.L.yyyy', date);

// "shorTime" means format "H.mm"
export const mapToShortTime = (date?: DateLike | null) =>
  formatDateWithoutLocale('H.mm', date);

// "shortDateTime" means format "D.M.YYYY H.mm"
export const mapToShortDateTime = (date?: DateLike | null) =>
  formatDateWithoutLocale('d.L.yyyy H.mm', date);

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

export const isDateInRange = (
  date: DateTime,
  startDate?: Maybe<DateTime>,
  endDate?: Maybe<DateTime>,
) => {
  return (
    (!startDate?.isValid || date >= startDate) &&
    (!endDate?.isValid || date <= endDate)
  );
};

// The luxon Interval does not handle infinite start/end, so using MIN_DATE and MAX_DATE instead
export const mapValidityPeriodToInterval = (entity: ValidityPeriod) =>
  Interval.fromDateTimes(
    entity.validity_start ?? MIN_DATE,
    entity.validity_end ?? MAX_DATE,
  );

export const areValidityPeriodsOverlapping = (
  entity1: ValidityPeriod,
  entity2: ValidityPeriod,
) =>
  mapValidityPeriodToInterval(entity1).overlaps(
    mapValidityPeriodToInterval(entity2),
  );

export const padToTwoDigits = (number: number) =>
  padStart(number.toString(), 2, '0');

export const mapDurationToShortTime = (duration: Duration) =>
  `${padToTwoDigits(duration.hours)}:${padToTwoDigits(duration.minutes)}`;

export const findEarliestTime = (times: ReadonlyArray<DateTime>) => {
  return DateTime.fromMillis(Math.min(...times.map((item) => item.toMillis())));
};

export const findLatestTime = (times: ReadonlyArray<DateTime>) => {
  return DateTime.fromMillis(Math.max(...times.map((item) => item.toMillis())));
};
