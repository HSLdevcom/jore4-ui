import { DateTime } from 'luxon';
import { isDateLike, parseDate } from '../../time';

// eslint-disable-next-line @typescript-eslint/ban-types
export type StoreType<T extends object> = {
  [Property in keyof T]: T[Property] extends DateTime ? string : T[Property];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function mapToStoreType<T extends object>(
  input: T,
  replaceFields: (keyof T)[],
): StoreType<T> {
  return Object.keys(input).reduce<StoreType<T>>((result, objectKey) => {
    const key = objectKey as keyof T;

    const value =
      replaceFields.includes(key) && DateTime.isDateTime(input[key])
        ? (input[key] as unknown as DateTime)?.toISO()
        : input[key];

    return {
      ...result,
      [key]: value,
    };
  }, {} as StoreType<T>);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function mapFromStoreType<T extends object>(
  input: StoreType<T>,
  replaceFields: (keyof T)[],
): T {
  return Object.keys(input).reduce<T>((result, objectKey) => {
    const key = objectKey as keyof StoreType<T>;

    const value =
      replaceFields.includes(key) && isDateLike(input[key])
        ? parseDate(input[key] as string)
        : input[key];

    return {
      ...result,
      [key]: value,
    };
  }, {} as T);
}
