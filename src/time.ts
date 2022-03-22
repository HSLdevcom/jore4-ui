import { DateTime, Settings } from 'luxon';
import { i18n } from './i18n';

Settings.defaultZone = 'Europe/Helsinki';

// date formats known by luxon: https://moment.github.io/luxon/#/formatting?id=presets
export const formatDate = (
  format: Intl.DateTimeFormatOptions,
  date?: DateTime | string,
  locale?: string,
) => {
  if (!date) {
    return undefined;
  }

  // assuming that string inputs are in ISO format
  const dateTime = DateTime.isDateTime(date) ? date : DateTime.fromISO(date);

  // if not explicitly defined, the i18n locale is used
  const dateLocale = locale || i18n.language;

  return dateTime.setLocale(dateLocale).toLocaleString(format);
};

export const mapToShortDate = (date?: DateTime | string, locale?: string) =>
  formatDate(DateTime.DATE_SHORT, date, locale);

export const mapToShortDateTime = (date?: DateTime | string, locale?: string) =>
  formatDate(DateTime.DATETIME_SHORT, date, locale);

export const parseISODateString = (date?: string) =>
  date ? DateTime.fromISO(date) : undefined;

export const mapToISODate = (date: string) =>
  date ? DateTime.fromISO(date).toISODate() : undefined;

export const MIN_DATE = DateTime.fromISO('1970-01-01').startOf('day');
export const MAX_DATE = DateTime.fromISO('2050-12-31').endOf('day');

export const isDateInRange = (
  date: DateTime,
  startDate: DateTime,
  endDate?: DateTime,
) => {
  return date >= startDate && (!endDate || date <= endDate);
};
