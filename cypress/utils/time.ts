import { DateTime, Settings } from 'luxon';

Settings.throwOnInvalid = true;
Settings.defaultZone = 'Europe/Helsinki';

/**
 * Formats a DateTime instance to short date format (d.L.yyyy) in Finnish locale.
 * @param date - The DateTime instance to format
 * @returns Formatted date string, or empty string if date is null/undefined
 * @example
 * formatShortDate(DateTime.local(2026, 5, 7)) // returns "7.5.2026"
 */
export function formatShortDate(date: DateTime | null | undefined): string {
  if (!date) {
    return '';
  }
  return date.setLocale('fi').toFormat('d.L.yyyy');
}

export const TS_WANTS_AN_EXPORT = 0;
