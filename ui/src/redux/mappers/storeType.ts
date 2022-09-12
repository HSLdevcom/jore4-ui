import isArray from 'lodash/isArray';
import { DateTime } from 'luxon';
import { isLine, isRoute, isStop } from '../../graphql';
import { isDateLike, parseDate } from '../../time';
import {
  getObjectStringKeys,
  isPlainObject,
  PlainObject,
} from '../../utils/object';

// types that must be serialized
type SerializedTypes = DateTime;

// recusively replaces DateTime property types with strings within the input type
export type StoreType<T extends PlainObject> = {
  [Property in keyof T]: T[Property] extends PlainObject // object property -> recurse
    ? StoreType<T[Property]>
    : T[Property] extends Array<infer U> // array property -> must check inner type
    ? U extends PlainObject // array of objects -> recurse
      ? Array<StoreType<U>>
      : Array<U>
    : T[Property] extends SerializedTypes // serializable property -> convert to string
    ? string
    : T[Property]; // other scalar type -> leave as is
};

export type SerializerFunction<
  T extends PlainObject = PlainObject,
  TValue = ValueOf<T>,
> = (key: StringKeyOf<T>, value: TValue, parentObject: T) => TValue | string;

export type DeserializerFunction<
  T extends PlainObject = PlainObject,
  TValue = ValueOf<T>,
> = (
  key: StringKeyOf<T>,
  value: TValue,
  parentObject: T,
) => TValue | SerializedTypes;

const defaultSerializer: SerializerFunction = <
  T extends PlainObject = PlainObject,
  TValue = ValueOf<T>,
>(
  key: StringKeyOf<T>,
  value: TValue,
  parentObject: T,
) => {
  if (
    (isStop(parentObject) || isRoute(parentObject) || isLine(parentObject)) &&
    ['validity_start', 'validity_end'].includes(key) &&
    DateTime.isDateTime(value)
  ) {
    return value.toISO();
  }

  return value;
};

const defaultDeserializer: DeserializerFunction = <
  T extends PlainObject = PlainObject,
  TValue = ValueOf<T>,
>(
  key: StringKeyOf<T>,
  value: TValue,
  parentObject: T,
) => {
  if (
    (isStop(parentObject) || isRoute(parentObject) || isLine(parentObject)) &&
    ['validity_start', 'validity_end'].includes(key) &&
    isDateLike(value)
  ) {
    return parseDate(value);
  }

  return value;
};

export function mapToStoreType<T extends PlainObject>(
  input: T,
  serializerFunc: SerializerFunction = defaultSerializer,
): StoreType<T> {
  return getObjectStringKeys(input).reduce<StoreType<T>>((result, key) => {
    const value = input[key];

    // serialize the attribute value
    // Note: this has to be done first, so that object-like values like DateTime are serialized
    // and we wouldn't recurse into them
    const serializedValue = serializerFunc(key, value, input);

    // value is an array
    if (isArray(serializedValue)) {
      return {
        ...result,
        [key]: serializedValue.map((item) =>
          // array item is an object -> recurse
          isPlainObject(item) ? mapToStoreType(item, serializerFunc) : item,
        ),
      };
    }

    // the value is an object -> recurse
    if (isPlainObject(serializedValue)) {
      return {
        ...result,
        [key]: mapToStoreType(serializedValue, serializerFunc),
      };
    }

    // other scalar value -> return as is
    return {
      ...result,
      [key]: serializedValue,
    };
  }, {} as StoreType<T>);
}

export function mapFromStoreType<T extends PlainObject>(
  input: StoreType<T>,
  deserializerFunc: DeserializerFunction = defaultDeserializer,
): T {
  return getObjectStringKeys(input).reduce<T>((result, key) => {
    const value = input[key];

    // value is an array
    if (isArray(value)) {
      return {
        ...result,
        [key]: value.map((item) =>
          // array item is an object -> recurse
          isPlainObject(item) ? mapFromStoreType(item, deserializerFunc) : item,
        ),
      };
    }

    // the value is an object -> recurse
    if (isPlainObject(value)) {
      return {
        ...result,
        [key]: mapFromStoreType(value, deserializerFunc),
      };
    }

    // serialize the attribute value
    // Note: this has to be done last, so that object-like values like DateTime are deserialized
    // only afterwards and we wouldn't recurse into them
    const deserializedValue = deserializerFunc(key, value, input);

    // other scalar value -> return as is
    return {
      ...result,
      [key]: deserializedValue,
    };
  }, {} as T);
}
