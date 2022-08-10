import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import { DateTime } from 'luxon';
import { isLine, isRoute, isStop } from '../../graphql';
import { isDateLike, parseDate } from '../../time';
import { isPlainObject, PlainObject } from '../../utils';

// recusively replaces DateTime property types with strings within the input type
export type StoreType<T extends PlainObject> = {
  [Property in keyof T]: T[Property] extends PlainObject // object property -> recurse
    ? StoreType<T[Property]>
    : T[Property] extends Array<infer U> // array property -> must check inner type
    ? U extends PlainObject // array of objects -> recurse
      ? Array<StoreType<U>>
      : Array<U>
    : T[Property] extends DateTime // DateTime property -> convert to string
    ? string
    : T[Property]; // other scalar type -> leave as is
};

type ReplacedFieldsFunc = (entity: unknown) => string[];
const getReplacedFields: ReplacedFieldsFunc = (entity: unknown) => {
  if (isStop(entity) || isRoute(entity) || isLine(entity)) {
    return ['validity_start', 'validity_end'];
  }

  return [];
};

export function mapToStoreType<T extends PlainObject>(
  input: T,
  replacedFieldsFunc: ReplacedFieldsFunc = getReplacedFields,
): StoreType<T> {
  const replacedFields = replacedFieldsFunc(input);

  return Object.keys(input).reduce<StoreType<T>>((result, objectKey) => {
    const key = objectKey as keyof T;
    const value = input[key];

    // the value is to be serialized and is a DateTime -> convert to string
    if (
      isString(key) &&
      replacedFields.includes(key) &&
      DateTime.isDateTime(value)
    ) {
      return {
        ...result,
        [key]: value.toISO(),
      };
    }

    // value is an array -> recurse (warning: array is also an object in javascript)
    if (isArray(value)) {
      return {
        ...result,
        [key]: value.map((item) => mapToStoreType(item, replacedFieldsFunc)),
      };
    }

    // the value is an object (and is not a date) -> recurse
    if (isPlainObject(value) && !DateTime.isDateTime(value)) {
      return {
        ...result,
        [key]: mapToStoreType(value, replacedFieldsFunc),
      };
    }

    // other scalar value -> return as is
    return {
      ...result,
      [key]: value,
    };
  }, {} as StoreType<T>);
}

export function mapFromStoreType<T extends PlainObject>(
  input: StoreType<T>,
  replacedFieldsFunc: ReplacedFieldsFunc = getReplacedFields,
): T {
  const replacedFields = replacedFieldsFunc(input);

  return Object.keys(input).reduce<T>((result, objectKey) => {
    const key = objectKey as keyof T;
    const value = input[key];

    // value is an array -> recurse
    if (isArray(value)) {
      return {
        ...result,
        [key]: value.map((item) => mapFromStoreType(item, replacedFieldsFunc)),
      };
    }

    // the value is an object -> recurse
    if (isPlainObject(value)) {
      return {
        ...result,
        [key]: mapFromStoreType(value, replacedFieldsFunc),
      };
    }

    // the value is to be deserialized and is date like -> convert to DateTime
    if (isString(key) && replacedFields.includes(key) && isDateLike(value)) {
      return {
        ...result,
        [key]: parseDate(value),
      };
    }

    // other scalar value -> return as is
    return {
      ...result,
      [key]: value,
    };
  }, {} as T);
}
