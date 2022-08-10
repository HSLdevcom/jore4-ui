import { DateTime } from 'luxon';

export type PlainObject = Record<string, unknown>;

export const isPlainObject = (input: unknown): input is PlainObject => {
  return (
    typeof input === 'object' &&
    input !== null &&
    !Array.isArray(input) &&
    !DateTime.isDateTime(input)
  );
};

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
