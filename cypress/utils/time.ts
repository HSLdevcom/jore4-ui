// All points in time are handled in Helsinki, regardless of the time zone of
// the system the tests are running on.
export const TIME_ZONE = 'Europe/Helsinki';

// The only places that read the clock.
export function now(): Temporal.ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO(TIME_ZONE);
}

export function today(): Temporal.PlainDate {
  return Temporal.Now.plainDateISO(TIME_ZONE);
}

/** Checks whether the value is an instance of any of the Temporal types. */
export function isTemporalValue(value: unknown): boolean {
  return Object.prototype.toString.call(value).startsWith('[object Temporal.');
}

/**
 * Formats a date to short date format (d.M.yyyy). Formatted by hand, so that
 * the output does not depend on the browser locale.
 * @param date - The date to format
 * @returns Formatted date string, or empty string if date is null/undefined
 * @example
 * formatShortDate(Temporal.PlainDate.from('2026-05-07')) // returns "7.5.2026"
 */
export function formatShortDate(
  date: Temporal.PlainDate | null | undefined,
): string {
  if (!date) {
    return '';
  }

  return `${date.day}.${date.month}.${date.year}`;
}

/**
 * Serializes a moment in time into a form that Hasura, Tiamat and Postgres
 * accept. `ZonedDateTime.toString()` would add a `[Europe/Helsinki]` time zone
 * annotation, which they do not understand.
 */
export function serializeDateTime(value: Temporal.ZonedDateTime): string {
  return value.toString({ timeZoneName: 'never' });
}

/**
 * Builds the moment the given Helsinki day starts, for the fields that are
 * moments in time instead of plain dates.
 *
 * @example
 * startOfDay(Temporal.PlainDate.from('2020-01-01')) // 2020-01-01T00:00:00+02:00[Europe/Helsinki]
 */
export function startOfDay(date: Temporal.PlainDate): Temporal.ZonedDateTime {
  return date.toZonedDateTime(TIME_ZONE);
}
