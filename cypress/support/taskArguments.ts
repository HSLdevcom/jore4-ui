import { serializeDateTime } from '../utils/time';

/**
 * `cy.task` serializes its arguments with `JSON.stringify`, which turns
 * `Temporal.ZonedDateTime` values into strings with a time zone annotation,
 * eg. `2020-01-01T00:00:00+02:00[Europe/Helsinki]`. Hasura, Tiamat and
 * Postgres do not understand the annotation, while the rest of the Temporal
 * serialization formats are valid for them as is.
 *
 * The annotations are dropped here, at the task end, so that spec files can
 * pass their test data to the tasks as it is, without having to remember to
 * serialize each time value by hand.
 */

const TIME_ZONE_ANNOTATION = /^\d{4}-\d{2}-\d{2}T[^[\]]+\[[^[\]]+\]$/;

function normalizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return TIME_ZONE_ANNOTATION.test(value)
      ? serializeDateTime(Temporal.ZonedDateTime.from(value))
      : value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeValue(item)]),
    );
  }

  return value;
}

type TaskFunction = (argument: never) => unknown;

/**
 * Wraps the task functions so that the time values of their arguments are in a
 * form that the databases accept.
 */
export function withNormalizedTimeValues<
  Tasks extends Readonly<Record<string, TaskFunction>>,
>(tasks: Tasks): Tasks {
  const normalizedTasks = Object.entries<TaskFunction>(tasks).map(
    ([name, task]) =>
      [
        name,
        (argument: never) => task(normalizeValue(argument) as never),
      ] as const,
  );

  return Object.fromEntries(normalizedTasks) as Tasks;
}
