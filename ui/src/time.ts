import isString from 'lodash/isString';
import padStart from 'lodash/padStart';
import { DateTime, Duration, Interval, Settings } from 'luxon';
import { Maybe, ValidityPeriod } from './generated/graphql';
import { i18n } from './i18n';

Settings.defaultZone = 'Europe/Helsinki';

declare module 'luxon' {
  // This is in fact false at the moment.
  // Previous versions of the luxon typings did not care about validity.
  // Currently, our code base can produce NPEs when working with Luxon classes.
  // Settings.throwOnInvalid = true; should be set next to defaultZone.
  // TODO: Set the throwOnInvalid setting or fix the codebase to deal with nulls produced by Luxon.
  interface TSSettings {
    throwOnInvalid: true;
  }
}

export type DateLike = DateTime | string;

export function isDateLike(input?: unknown): input is DateLike {
  return DateTime.isDateTime(input) || isString(input);
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

  // if valid DateTime from date string, return it
  // can handle yyyy-mm-dd date strings as well
  const dt = DateTime.fromISO(date);
  if (dt.isValid) {
    return dt;
  }

  throw new Error(`Invalid date input: ${date}`);
}

// date formats known by luxon: https://moment.github.io/luxon/#/formatting?id=presets
export const formatDate = (
  format: string,
  date?: DateLike | null,
  locale?: string,
) => {
  const dateTime = parseDate(date);
  if (!dateTime) {
    return undefined;
  }

  // if not explicitly defined, the i18n locale is used
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const dateLocale = locale || i18n.language;

  return dateTime.setLocale(dateLocale).toFormat(format);
};

// "shortDate" means format DD.MM.YYYY
export const mapToShortDate = (date?: DateLike | null, locale?: string) =>
  formatDate('d.L.yyyy', date, locale);

export const mapToShortDateTime = (date?: DateLike | null, locale?: string) =>
  formatDate('d.L.yyyy t', date, locale);

export const mapToISODate = (date?: DateLike | null) =>
  parseDate(date)?.toISODate();

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

export const findEarliestTime = (times: DateTime[]) => {
  return DateTime.fromMillis(Math.min(...times.map((item) => item.toMillis())));
};

export const findLatestTime = (times: DateTime[]) => {
  return DateTime.fromMillis(Math.max(...times.map((item) => item.toMillis())));
};

export function toUtcDate(dateTime: DateTime): DateTime {
  return DateTime.utc(dateTime.year, dateTime.month, dateTime.day);
}
