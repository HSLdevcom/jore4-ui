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

const HAS_OFFSET = /T.*([zZ]|[+-]\d{2}(:?\d{2})?)$/;

/**
 * Parses a moment in time. Strings without an offset are assumed to be in UTC,
 * matching the convention of `ui/src/time/dateTime.ts`.
 */
export function parseDateTime(dateTime: string): Temporal.ZonedDateTime {
  const instant = Temporal.Instant.from(
    HAS_OFFSET.test(dateTime) ? dateTime : `${dateTime}Z`,
  );

  return instant.toZonedDateTimeISO(TIME_ZONE);
}

/**
 * Serializes a moment in time into a form that Hasura and Postgres accept.
 * `ZonedDateTime.toString()` would add a `[Europe/Helsinki]` time zone
 * annotation, which they do not understand.
 */
export function serializeDateTime(value: Temporal.ZonedDateTime): string {
  return value.toString({ timeZoneName: 'never' });
}

/**
 * Narrows a value of a GraphQL `interval` field into a `Temporal.Duration`.
 * The generated input types also allow the serialized form, as a part of the
 * test data is built in Cypress spec files and crosses the `cy.task` JSON
 * boundary before it is inserted into the database.
 */
export function toDuration(
  value: Temporal.Duration | string,
): Temporal.Duration {
  return Temporal.Duration.from(value);
}

export function multiplyDuration(
  duration: Temporal.Duration,
  multiplier: number,
): Temporal.Duration {
  const milliseconds = duration.total({ unit: 'milliseconds' }) * multiplier;

  return Temporal.Duration.from({ milliseconds }).round({
    largestUnit: 'hours',
  });
}
