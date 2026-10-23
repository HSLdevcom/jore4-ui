import isString from 'lodash/isString';
import { SerializerFunction } from '..';
import { parseDate } from '../../time/date';
import {
  DeserializerFunction,
  PlainObject,
  mapFromStoreType,
  mapToStoreType,
} from './storeType';

function expectDateToBeSerialized(input: unknown, output: unknown) {
  expect(input).toBeInstanceOf(Temporal.PlainDate);
  expect(typeof output).toEqual('string');
  expect((input as Temporal.PlainDate).toString()).toEqual(output);
}

function expectDateToBeDeserialized(input: unknown, output: unknown) {
  expect(typeof input).toEqual('string');
  expect(output).toBeInstanceOf(Temporal.PlainDate);
  expect((output as Temporal.PlainDate).toString()).toEqual(input);
}

describe('redux object de/serializing', () => {
  const serializer: SerializerFunction = <
    T extends PlainObject = PlainObject,
    TValue = ValueOf<T>,
  >(
    key: StringKeyOf<T>,
    value: TValue,
  ) => {
    if (key === 'toSerialize' && value instanceof Temporal.PlainDate) {
      return value.toString();
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
    if (key === 'toSerialize' && isString(value)) {
      return parseDate(value);
    }
    return value;
  };

  describe(`${mapToStoreType.name}`, () => {
    it('should not touch attributes that are not part of the serializer function (even dates)', () => {
      const input = {
        str: '2022-08-11',
        num: 1660546539855,
        func: () => Temporal.PlainDate.from('2022-08-11'),
        date: Temporal.PlainDate.from('2022-08-11'),
      };

      const output = mapToStoreType(input, serializer);

      expect(output).toEqual(input);
    });

    it('should not recurse into ZonedDateTimes', () => {
      const date = Temporal.ZonedDateTime.from(
        '2022-08-11T06:39:39.766+03:00[Europe/Helsinki]',
      );

      const output = mapToStoreType({ date }, serializer);

      expect(output.date).toBe(date);
    });

    it('should serialize the change time of line change history by default', () => {
      const input = {
        __typename: 'route_line_change_history',
        changed: Temporal.ZonedDateTime.from(
          '2022-08-11T06:39:39.766+03:00[Europe/Helsinki]',
        ),
      };

      const output = mapToStoreType(input);

      expect(output.changed).toEqual('2022-08-11T06:39:39.766+03:00');
    });

    it('should serialize attributes that are part of the serializer function', () => {
      const input = {
        toSerialize: Temporal.PlainDate.from('2022-08-11'),
      };

      const output = mapToStoreType(input, serializer);

      expect(input).not.toEqual(output);
      expectDateToBeSerialized(input.toSerialize, output.toSerialize);
    });

    it('should recurse into objects', () => {
      const input = {
        embedded: {
          toSerialize: Temporal.PlainDate.from('2022-08-11'),
          otherDate: Temporal.PlainDate.from('2022-08-11'),
        },
      };

      const output = mapToStoreType(input, serializer);

      expect(input).not.toEqual(output);
      expect(input.embedded.otherDate).toEqual(output.embedded.otherDate);
      expectDateToBeSerialized(
        input.embedded.toSerialize,
        output.embedded.toSerialize,
      );
    });

    it('should recurse into arrays', () => {
      const input = {
        embedded: [
          {
            toSerialize: Temporal.PlainDate.from('2022-08-11'),
            otherDate: Temporal.PlainDate.from('2022-08-11'),
          },
        ],
      };

      const output = mapToStoreType(input, serializer);

      expect(input).not.toEqual(output);
      expect(input.embedded[0].otherDate).toEqual(output.embedded[0].otherDate);
      expectDateToBeSerialized(
        input.embedded[0].toSerialize,
        output.embedded[0].toSerialize,
      );
    });

    it('should not serialize array of scalars', () => {
      const input = {
        array: [
          '2022-08-11',
          1660546539855,
          () => Temporal.PlainDate.from('2022-08-11'),
          Temporal.PlainDate.from('2022-08-11'),
        ],
      };

      const output = mapToStoreType(input, serializer);

      expect(input).toEqual(output);
    });
  });

  describe(`${mapFromStoreType.name}`, () => {
    it('should not touch attributes that are not part of the deserializer function (even dates)', () => {
      const input = {
        str: '2022-08-11',
        num: 1660546539855,
        func: () => Temporal.PlainDate.from('2022-08-11'),
        date: Temporal.PlainDate.from('2022-08-11'),
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
        toSerialize: '2022-08-11',
      };

      const output = mapFromStoreType(input, deserializer);

      expect(input).not.toEqual(output);
      expectDateToBeDeserialized(input.toSerialize, output.toSerialize);
    });

    it('should recurse into objects', () => {
      const input = {
        embedded: {
          toSerialize: '2022-08-11',
          otherDate: '2022-08-11',
        },
      };

      const output = mapFromStoreType(input, deserializer);

      expect(input).not.toEqual(output);
      expect(input.embedded.otherDate).toEqual(output.embedded.otherDate);
      expectDateToBeDeserialized(
        input.embedded.toSerialize,
        output.embedded.toSerialize,
      );
    });

    it('should recurse into arrays', () => {
      const input = {
        embedded: [
          {
            toSerialize: '2022-08-11',
            otherDate: '2022-08-11',
          },
        ],
      };

      const output = mapFromStoreType(input, deserializer);

      expect(input).not.toEqual(output);
      expect(input.embedded[0].otherDate).toEqual(output.embedded[0].otherDate);
      expectDateToBeDeserialized(
        input.embedded[0].toSerialize,
        output.embedded[0].toSerialize,
      );
    });

    it('should not deserialize array of scalars', () => {
      const input = {
        array: [
          '2022-08-11',
          1660546539855,
          () => Temporal.PlainDate.from('2022-08-11'),
          Temporal.PlainDate.from('2022-08-11'),
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

  describe('reversibility', () => {
    it('should be able to retrieve the same input object after serializing and deserializing', () => {
      const input = {
        str: '2022-08-11',
        num: 1660546539855,
        func: () => Temporal.PlainDate.from('2022-08-11'),
        date: Temporal.PlainDate.from('2022-08-11'),
        toSerialize: Temporal.PlainDate.from('2022-08-11'),
        obj: {
          str: '2022-08-11',
          toSerialize: Temporal.PlainDate.from('2022-08-11'),
        },
        arr: [
          {
            str: '2022-08-11',
            toSerialize: Temporal.PlainDate.from('2022-08-11'),
          },
        ],
      };

      const serialized = mapToStoreType(input, serializer);
      const output = mapFromStoreType(serialized, deserializer);

      expect(output).toEqual(input);
    });
  });
});
