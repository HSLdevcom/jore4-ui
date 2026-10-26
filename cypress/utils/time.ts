// All points in time are handled in Helsinki, regardless of the time zone of
// the system the tests are running on.
export const TIME_ZONE = 'Europe/Helsinki';

// The only place that reads the clock.
export function now(): Temporal.ZonedDateTime {
  return Temporal.Now.instant().toZonedDateTimeISO(TIME_ZONE);
}

export function today(): Temporal.PlainDate {
  return now().toPlainDate();
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
 * Builds a Helsinki time moment for a `cy.task` argument.
 *
 * `cy.task` serializes its arguments with `JSON.stringify`, which would turn a
 * `Temporal.ZonedDateTime` into a string with a `[Europe/Helsinki]` time zone
 * annotation that Tiamat and Hasura reject. Serializing by hand keeps the wire
 * format valid. The return type matches the generated GraphQL input types,
 * which — like the rest of the `cy.task` boundary — describe the values before
 * serialization instead of the strings the task actually receives.
 *
 * @example
 * taskDateTime(Temporal.PlainDate.from('2020-01-01')) // sent as "2020-01-01T00:00:00+02:00"
 */
export function taskDateTime(
  value: Temporal.PlainDate | Temporal.ZonedDateTime,
): Temporal.ZonedDateTime {
  const dateTime =
    value instanceof Temporal.ZonedDateTime
      ? value
      : value.toZonedDateTime(TIME_ZONE);

  return serializeDateTime(dateTime) as unknown as Temporal.ZonedDateTime;
}
