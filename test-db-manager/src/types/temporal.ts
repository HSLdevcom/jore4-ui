/**
 * The GraphQL scalars that model a point in time, a date or a duration are
 * mapped to `Temporal.X | string` in the generated types: the test code builds
 * them as Temporal values, but a part of the data is passed to the Node side
 * through `cy.task`, which serializes its arguments with `JSON.stringify`.
 *
 * These helpers pick the form that is actually in use at hand, so that neither
 * side has to narrow the union by hand. Both of them walk through the whole
 * type, so that also the nested time values, eg.
 * `StopAreaInput.StopArea.validBetween.fromDate`, are converted.
 */

// The Temporal types that the time related GraphQL scalars are mapped to.
type TemporalValue =
  Temporal.Duration | Temporal.PlainDate | Temporal.ZonedDateTime;

type AnyFunction = (...args: never[]) => unknown;

/**
 * The form the values have after they have been serialized, ie. after they
 * have crossed the `cy.task` boundary: every time value is a string.
 *
 * @example
 * type SerializedStopAreaInput = StripTemporalTypes<StopAreaInput>;
 */
export type StripTemporalTypes<T> = T extends TemporalValue
  ? string
  : T extends AnyFunction
    ? T
    : T extends object
      ? { [Key in keyof T]: StripTemporalTypes<T[Key]> }
      : T;

/**
 * The form the values have before they have been serialized, ie. while the
 * test data is still being built: every time value is a Temporal value. Fields
 * that are plain strings in the first place are left as they are.
 *
 * @example
 * type BuiltStopAreaInput = StripSerializedTypes<StopAreaInput>;
 */
export type StripSerializedTypes<T> = [Extract<T, TemporalValue>] extends [
  never,
]
  ? T extends AnyFunction
    ? T
    : T extends object
      ? { [Key in keyof T]: StripSerializedTypes<T[Key]> }
      : T
  : Exclude<T, string>;
