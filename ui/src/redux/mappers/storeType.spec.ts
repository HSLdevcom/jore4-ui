import { DateTime } from 'luxon';
import { SerializerFunction } from '..';
import { isDateLike, parseDate } from '../../time';
import { PlainObject } from '../../utils';
import {
  DeserializerFunction,
  mapFromStoreType,
  mapToStoreType,
} from './storeType';

const expectDateTimeToBeSerialized = (input: unknown, output: unknown) => {
  expect(input).toBeInstanceOf(DateTime);
  expect(typeof output).toEqual('string');
  expect((input as DateTime).toISO()).toEqual(output);
};

const expectDateTimeToBeDeserialized = (input: unknown, output: unknown) => {
  expect(typeof input).toEqual('string');
  expect(output).toBeInstanceOf(DateTime);
  expect((output as DateTime).toISO()).toEqual(input);
};

describe(`redux object de/serializing`, () => {
  const serializer: SerializerFunction = <
    T extends PlainObject = PlainObject,
    TValue = ValueOf<T>,
  >(
    key: StringKeyOf<T>,
    value: TValue,
  ) => {
    if (key === 'toSerialize' && DateTime.isDateTime(value)) {
      return value.toISO();
    }
    return value;
  };

  const deserializer: DeserializerFunction = <
    T extends PlainObject = PlainObject,
    TValue = ValueOf<T>,
  >(
    key: StringKeyOf<T>,
    value: TValue,
  ) => {
    if (key === 'toSerialize' && isDateLike(value)) {
      return parseDate(value);
    }
    return value;
  };

  describe(`${mapToStoreType.name}`, () => {
    it('should not touch attributes that are not part of the serializer function (even DateTimes)', () => {
      const input = {
        str: '2022-08-11T06:39:39.766+03:00',
        num: 1660546539855,
        func: () => DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        date: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
      };

      const output = mapToStoreType(input, serializer);

      expect(output).toEqual(input);
    });

    it('should serialize attributes that are part of the serializer function', () => {
      const input = {
        toSerialize: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
      };

      const output = mapToStoreType(input, serializer);

      expect(input).not.toEqual(output);
      expectDateTimeToBeSerialized(input.toSerialize, output.toSerialize);
    });

    it('should recurse into objects', () => {
      const input = {
        embedded: {
          toSerialize: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
          otherDate: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        },
      };

      const output = mapToStoreType(input, serializer);

      expect(input).not.toEqual(output);
      expect(input.embedded.otherDate).toEqual(output.embedded.otherDate);
      expectDateTimeToBeSerialized(
        input.embedded.toSerialize,
        output.embedded.toSerialize,
      );
    });

    it('should recurse into arrays', () => {
      const input = {
        embedded: [
          {
            toSerialize: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
            otherDate: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
          },
        ],
      };

      const output = mapToStoreType(input, serializer);

      expect(input).not.toEqual(output);
      expect(input.embedded[0].otherDate).toEqual(output.embedded[0].otherDate);
      expectDateTimeToBeSerialized(
        input.embedded[0].toSerialize,
        output.embedded[0].toSerialize,
      );
    });

    it('should not serialize array of scalars', () => {
      const input = {
        array: [
          '2022-08-11T06:39:39.766+03:00',
          1660546539855,
          () => DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
          DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        ],
      };

      const output = mapToStoreType(input, serializer);

      expect(input).toEqual(output);
    });
  });

  describe(`${mapFromStoreType.name}`, () => {
    it('should not touch attributes that are not part of the deserializer function (even DateTimes)', () => {
      const input = {
        str: '2022-08-11T06:39:39.766+03:00',
        num: 1660546539855,
        func: () => DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        date: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
      };

      const output = mapFromStoreType(
        // for the sake of this test, we want to show that deserializing works also with non-StoreTypes
        input as PlainObject,
        deserializer,
      );

      expect(output).toEqual(input);
    });

    it('should deserialize attributes that are part of the serializer function', () => {
      const input = {
        toSerialize: '2022-08-11T06:39:39.766+03:00',
      };

      const output = mapFromStoreType(input, deserializer);

      expect(input).not.toEqual(output);
      expectDateTimeToBeDeserialized(input.toSerialize, output.toSerialize);
    });

    it('should recurse into objects', () => {
      const input = {
        embedded: {
          toSerialize: '2022-08-11T06:39:39.766+03:00',
          otherDate: '2022-08-11T06:39:39.766+03:00',
        },
      };

      const output = mapFromStoreType(input, deserializer);

      expect(input).not.toEqual(output);
      expect(input.embedded.otherDate).toEqual(output.embedded.otherDate);
      expectDateTimeToBeDeserialized(
        input.embedded.toSerialize,
        output.embedded.toSerialize,
      );
    });

    it('should recurse into arrays', () => {
      const input = {
        embedded: [
          {
            toSerialize: '2022-08-11T06:39:39.766+03:00',
            otherDate: '2022-08-11T06:39:39.766+03:00',
          },
        ],
      };

      const output = mapFromStoreType(input, deserializer);

      expect(input).not.toEqual(output);
      expect(input.embedded[0].otherDate).toEqual(output.embedded[0].otherDate);
      expectDateTimeToBeDeserialized(
        input.embedded[0].toSerialize,
        output.embedded[0].toSerialize,
      );
    });

    it('should not deserialize array of scalars', () => {
      const input = {
        array: [
          '2022-08-11T06:39:39.766+03:00',
          1660546539855,
          () => DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
          DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        ],
      };

      const output = mapFromStoreType(
        // for the sake of this test, we want to show that deserializing works also with non-StoreTypes
        input as PlainObject,
        deserializer,
      );

      expect(input).toEqual(output);
    });
  });

  describe(`reversibility`, () => {
    it('should be able to retrieve the same input object after serializing and deserializing', () => {
      const input = {
        str: '2022-08-11T06:39:39.766+03:00',
        num: 1660546539855,
        func: () => DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        date: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        toSerialize: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        obj: {
          str: '2022-08-11T06:39:39.766+03:00',
          toSerialize: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
        },
        arr: [
          {
            str: '2022-08-11T06:39:39.766+03:00',
            toSerialize: DateTime.fromISO('2022-08-11T06:39:39.766+03:00'),
          },
        ],
      };

      const serialized = mapToStoreType(input, serializer);
      const output = mapFromStoreType(serialized, deserializer);

      expect(output).toEqual(input);
    });
  });
});
