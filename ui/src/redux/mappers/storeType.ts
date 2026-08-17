import isArray from 'lodash/isArray';
import { DateTime } from 'luxon';
import { isDateLike, parseDate } from '../../time';
import {
  isLine,
  isRoute,
  isRouteLineChangeHistory,
  isScheduledStopPoint,
  isValidBetween,
} from '../../utils';

// types that must be serialized
type SerializedTypes = DateTime;

// recursively replaces DateTime property types with strings within the input type
export type StoreType<T> = T extends SerializedTypes // serializable property -> convert to string
  ? string
  : T extends Array<infer U> // array -> recurse
    ? ReadonlyArray<StoreType<U>>
    : T extends PlainObject // object -> recurse
      ? {
          readonly [Property in keyof T]: StoreType<T[Property]>;
        }
      : T; // otherwise return as-is

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
    (isScheduledStopPoint(parentObject) ||
      isRoute(parentObject) ||
      isLine(parentObject) ||
      isValidBetween(parentObject) ||
      isRouteLineChangeHistory(parentObject)) &&
    [
      'validity_start',
      'validity_end',
      'fromDate',
      'toDate',
      'changed',
    ].includes(key) &&
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
    (isScheduledStopPoint(parentObject) ||
      isRoute(parentObject) ||
      isLine(parentObject)) &&
    ['validity_start', 'validity_end'].includes(key) &&
    isDateLike(value)
  ) {
    return parseDate(value);
  }

  return value;
};

// using ExplicitAny instead of unknown so that also interface types would be compatible
export type PlainObject = Record<string, ExplicitAny>;

function getObjectStringKeys<T extends PlainObject>(input: T) {
  return Object.keys(input).filter(
    (item) => typeof item === 'string',
  ) as StringKeyOf<T>[];
}

function isPlainObject(input: unknown): input is PlainObject {
  return (
    typeof input === 'object' &&
    input !== null &&
    !Array.isArray(input) &&
    !DateTime.isDateTime(input)
  );
}

function assertIsPlainObject(input: unknown): asserts input is PlainObject {
  if (!isPlainObject(input)) {
    throw new TypeError(
      `Expected input to be a plain object, but it is of type: ${typeof input} value of: ${input}`,
    );
  }
}

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
        // @ts-expect-error Something's wonky with the StoreType, ts things its not an object
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
        // @ts-expect-error Something's wonky with the StoreType, ts things its not an object
        ...result,
        [key]: mapToStoreType(serializedValue, serializerFunc),
      };
    }

    // other scalar value -> return as is
    return {
      // @ts-expect-error Something's wonky with the StoreType, ts things its not an object
      ...result,
      [key]: serializedValue,
    };
  }, {} as StoreType<T>);
}

export function mapFromStoreType<T extends PlainObject>(
  input: StoreType<T>,
  deserializerFunc: DeserializerFunction = defaultDeserializer,
): T {
  // Something's wonky with the StoreType,
  // and TS believes it could be a string in here,
  // even tough T extends PlainObject.
  assertIsPlainObject(input);

  return getObjectStringKeys(input).reduce<T>((result, key) => {
    const value = input[key];

    // value is an array
    if (isArray(value)) {
      return {
        ...result,
        [key]: value.map((item: unknown) =>
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
