import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import { DateTime, Settings } from 'luxon';
import { i18n } from './i18n';

Settings.defaultZone = 'Europe/Helsinki';

export type DateLike = DateTime | string | null;

export function isDateLike(input?: unknown): input is DateLike {
  return DateTime.isDateTime(input) || isString(input) || isNil(input);
}

export const parseDate = (date?: DateLike) => {
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
};

// date formats known by luxon: https://moment.github.io/luxon/#/formatting?id=presets
export const formatDate = (
  format: Intl.DateTimeFormatOptions,
  date?: DateLike,
  locale?: string,
) => {
  const dateTime = parseDate(date);
  if (!dateTime) {
    return undefined;
  }

  // if not explicitly defined, the i18n locale is used
  const dateLocale = locale || i18n.language;

  return dateTime.setLocale(dateLocale).toLocaleString(format);
};

export const mapToShortDate = (date?: DateLike, locale?: string) =>
  formatDate(DateTime.DATE_SHORT, date, locale);

export const mapToShortDateTime = (date?: DateLike, locale?: string) =>
  formatDate(DateTime.DATETIME_SHORT, date, locale);

export const mapToISODate = (date?: DateLike) => parseDate(date)?.toISODate();

export const MIN_DATE = DateTime.fromISO('1970-01-01').startOf('day');
export const MAX_DATE = DateTime.fromISO('2050-12-31').endOf('day');
