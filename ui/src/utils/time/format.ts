import padStart from 'lodash/padStart';
import { DateLike, parseDate } from './date';

// Formatted by hand, so that the output does not depend on the browser locale.

export function padToTwoDigits(number: number) {
  return padStart(number.toString(), 2, '0');
}

// "shortDate" means format "D.M.YYYY"
export function mapToShortDate(date?: DateLike | null) {
  const plainDate = parseDate(date);
  return plainDate
    ? `${plainDate.day}.${plainDate.month}.${plainDate.year}`
    : undefined;
}

// "shortTime" means format "H.mm"
export function mapToShortTime(dateTime?: Temporal.ZonedDateTime | null) {
  return dateTime
    ? `${dateTime.hour}.${padToTwoDigits(dateTime.minute)}`
    : undefined;
}

// "shortDateTime" means format "D.M.YYYY H.mm"
export function mapToShortDateTime(dateTime?: Temporal.ZonedDateTime | null) {
  return dateTime
    ? `${mapToShortDate(dateTime.toPlainDate())} ${mapToShortTime(dateTime)}`
    : undefined;
}

export function mapDurationToShortTime(duration: Temporal.Duration) {
  return `${padToTwoDigits(duration.hours)}:${padToTwoDigits(duration.minutes)}`;
}
