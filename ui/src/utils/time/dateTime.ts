// All points in time are handled in Helsinki, regardless of the time zone of
// the system the UI is running on.
export const TIME_ZONE = 'Europe/Helsinki';

export type DateTimeLike = Temporal.ZonedDateTime | string;

// The only place that reads the clock, so that tests can mock it with
// jest.spyOn(Temporal.Now, 'instant').
export function now(): Temporal.ZonedDateTime {
  return Temporal.Now.instant().toZonedDateTimeISO(TIME_ZONE);
}

const HAS_OFFSET = /T.*([zZ]|[+-]\d{2}(:?\d{2})?)$/;

export function parseDateTime(dateTime: DateTimeLike): Temporal.ZonedDateTime;
export function parseDateTime(dateTime: null | undefined): undefined;
export function parseDateTime(
  dateTime: DateTimeLike | null | undefined,
): Temporal.ZonedDateTime | undefined;
export function parseDateTime(dateTime?: DateTimeLike | null) {
  if (!dateTime) {
    return undefined;
  }

  if (dateTime instanceof Temporal.ZonedDateTime) {
    return dateTime.withTimeZone(TIME_ZONE);
  }

  // If no offset is specified, assume UTC.
  const instant = Temporal.Instant.from(
    HAS_OFFSET.test(dateTime) ? dateTime : `${dateTime}Z`,
  );

  return instant.toZonedDateTimeISO(TIME_ZONE);
}
