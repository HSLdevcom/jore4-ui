import { DateTime } from 'luxon';
import { mapFromStoreType, mapToStoreType } from './mappers';

describe(`redux object de/serializing`, () => {
  const inputDateTime = {
    str: '2022-08-11T03:39:39.766Z', // not actual date
    num: 3,
    arrOfObjects: [
      // date within an array of objects
      { dat: DateTime.fromISO('2022-08-11T04:39:39.766Z') },
    ],
    func: () => {
      return 'foo';
    },
    // date as an object attribute
    dat: DateTime.fromISO('2022-08-11T06:39:39.766Z'),
    // date not marked for serialization
    dat2: DateTime.fromISO('2022-08-11T07:39:39.766Z'),
    obj: {
      attr: 'value',
      // date as a nested object attribute
      dat: DateTime.fromISO('2022-08-11T08:39:39.766Z'),
    },
  };

  const inputDateString = {
    str: '2022-08-11T03:39:39.766Z',
    num: 3,
    arrOfObjects: [
      // date within an array of objects
      { dat: '2022-08-11T07:39:39.766+03:00' },
    ],
    func: () => {
      return 'foo';
    },
    // date as an object attribute
    dat: '2022-08-11T09:39:39.766+03:00',
    // date not marked for serialization
    dat2: '2022-08-11T10:39:39.766+03:00',
    obj: {
      attr: 'value',
      // date as a nested object attribute
      dat: '2022-08-11T11:39:39.766+03:00',
    },
  };

  describe(`${mapToStoreType.name}`, () => {
    it('should leave input intact if no fields are to be replaced', () => {
      const customReplacer = () => [];
      const output = mapToStoreType(inputDateTime, customReplacer);

      // no changes are made to the input object as we don't have any replaced fields defined
      expect(output).toEqual(inputDateTime);
    });

    it('should recursively serialize DateTime fields defined by the replacer function', () => {
      const customReplacer = () => ['dat'];

      const output = mapToStoreType(inputDateTime, customReplacer);

      // desired DateTime fields are converted
      // Note: jest matchers are not working well with DateTime objects, thus better to observe endresult from the snapshot
      expect(output).toMatchSnapshot();
      expect(typeof output.str).toEqual('string');
      expect(output.dat2).toBeInstanceOf(DateTime);
    });
  });

  describe(`${mapFromStoreType.name}`, () => {
    it('should leave input intact if no fields are to be replaced', () => {
      const customReplacer = () => [];
      const output = mapFromStoreType(inputDateString, customReplacer);

      // no changes are made to the input object as we don't have any replaced fields defined
      expect(output).toEqual(inputDateString);
    });

    it('should recursively serialize DateTime fields defined by the replacer function', () => {
      const customReplacer = () => ['dat'];
      const output = mapFromStoreType(inputDateString, customReplacer);

      // desired DateTime fields are converted
      // Note: jest matchers are not working well with DateTime objects, thus better to observe endresult from the snapshot
      expect(output).toMatchSnapshot();
      expect(typeof output.str).toEqual('string');
      expect(typeof output.dat2).toEqual('string');
    });
  });

  describe(`reversibility`, () => {
    it('should be able to retrieve the same input object after serializing and deserializing', () => {
      const customReplacer = () => ['dat'];
      const output1 = mapToStoreType(inputDateTime, customReplacer);
      const output2 = mapFromStoreType(output1, customReplacer);

      expect(output2).toEqual(inputDateTime);
    });
  });
});
