import { DateTime } from 'luxon';

// using ExplicitAny instead of unknown so that also interface types would be compatible
export type PlainObject = Record<string, ExplicitAny>;

export const isPlainObject = (input: unknown): input is PlainObject => {
  return (
    typeof input === 'object' &&
    input !== null &&
    !Array.isArray(input) &&
    !DateTime.isDateTime(input)
  );
};

export function assertIsPlainObject(
  input: unknown,
): asserts input is PlainObject {
  if (!isPlainObject(input)) {
    throw new TypeError(
      `Expected input to be a plain object, but it is of type: ${typeof input} value of: ${input}`,
    );
  }
}

// the built-in Object.keys() method returns only a limited string[] type.
// The actual return type should be keyof T[]
export const getObjectKeys = <T extends PlainObject>(input: T) => {
  return Object.keys(input) as (keyof T)[];
};

export const getObjectStringKeys = <T extends PlainObject>(input: T) => {
  return Object.keys(input).filter(
    (item) => typeof item === 'string',
  ) as StringKeyOf<T>[];
};
