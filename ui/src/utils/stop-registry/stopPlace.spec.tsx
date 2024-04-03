import { StopRegistryNameType } from '../../generated/graphql';
import {
  setAlternativeName,
  setKeyValue,
  setMultipleAlternativeNames,
  setMultipleKeyValues,
} from './stopPlace';

describe('Stop place utils', () => {
  describe('setKeyValue', () => {
    it('should change only the value of existing key', () => {
      const initialKeyValues = [
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ];
      const result = setKeyValue(initialKeyValues, 'key2', ['newValue2']);
      expect(result).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['newValue2'] },
        { key: 'key3', values: ['value3'] },
      ]);

      expect(initialKeyValues).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ]);
    });

    it('should add a new key value pair', () => {
      const initialKeyValues = [
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ];
      const result = setKeyValue(initialKeyValues, 'key4', ['newValue4']);

      expect(result).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
        { key: 'key4', values: ['newValue4'] },
      ]);

      expect(initialKeyValues).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ]);
    });
  });

  describe('setMultipleKeyValues', () => {
    it('should change only the values of existing keys', () => {
      const initialKeyValues = [
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ];
      const result = setMultipleKeyValues(initialKeyValues, [
        { key: 'key2', values: ['newValue2'] },
        { key: 'key3', values: ['newValue3'] },
      ]);
      expect(result).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['newValue2'] },
        { key: 'key3', values: ['newValue3'] },
      ]);

      expect(initialKeyValues).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ]);
    });

    it('should add two new key value pairs', () => {
      const initialKeyValues = [
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ];
      const result = setMultipleKeyValues(initialKeyValues, [
        { key: 'key4', values: ['newValue4'] },
        { key: 'key5', values: ['newValue5'] },
      ]);

      expect(result).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
        { key: 'key4', values: ['newValue4'] },
        { key: 'key5', values: ['newValue5'] },
      ]);

      expect(initialKeyValues).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ]);
    });

    it('should add new key value and overwrite existing key value', () => {
      const initialKeyValues = [
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ];
      const result = setMultipleKeyValues(initialKeyValues, [
        { key: 'key3', values: ['newValue3'] },
        { key: 'key4', values: ['newValue4'] },
      ]);

      expect(result).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['newValue3'] },
        { key: 'key4', values: ['newValue4'] },
      ]);

      expect(initialKeyValues).toEqual([
        { key: 'key1', values: ['value1'] },
        { key: 'key2', values: ['value2'] },
        { key: 'key3', values: ['value3'] },
      ]);
    });
  });

  describe('setAlternativeName', () => {
    it('should change only the value of existing nameType/lang pair', () => {
      const initialAlternativeNames = [
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ];

      const result = setAlternativeName(initialAlternativeNames, {
        name: { lang: 'lang2', value: 'newValue2' },
        nameType: StopRegistryNameType.Alias,
      });

      expect(result).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);

      // Check that the original variable was not changed
      expect(initialAlternativeNames).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);
    });

    it('should add a new key value pair', () => {
      const initialAlternativeNames = [
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ];
      const result = setAlternativeName(initialAlternativeNames, {
        name: { lang: 'lang2', value: 'newValue2' },
        nameType: StopRegistryNameType.Translation,
      });
      expect(result).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Translation,
        },
      ]);

      // Check that the original variable was not changed
      expect(initialAlternativeNames).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);
    });
  });

  describe('setMultipleAlternativeNames', () => {
    it('should change only the values of existing nameType/lang pairs', () => {
      const initialAlternativeNames = [
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ];

      const result = setMultipleAlternativeNames(initialAlternativeNames, [
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'newValue3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);

      expect(result).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'newValue3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);

      // Check that the original variable was not changed
      expect(initialAlternativeNames).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);
    });

    it('should add new key value pairs', () => {
      const initialAlternativeNames = [
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ];
      const result = setMultipleAlternativeNames(initialAlternativeNames, [
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Label,
        },
      ]);
      expect(result).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Label,
        },
      ]);

      // Check that the original variable was not changed
      expect(initialAlternativeNames).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);
    });

    it('should add new key value pair and overwrite existing', () => {
      const initialAlternativeNames = [
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ];
      const result = setMultipleAlternativeNames(initialAlternativeNames, [
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'lang3', value: 'newValue3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);
      expect(result).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'newValue3' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'newValue2' },
          nameType: StopRegistryNameType.Translation,
        },
      ]);

      // Check that the original variable was not changed
      expect(initialAlternativeNames).toEqual([
        {
          name: { lang: 'lang1', value: 'value1' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang2', value: 'value2' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'lang3', value: 'value3' },
          nameType: StopRegistryNameType.Alias,
        },
      ]);
    });
  });
});
