import { deepStripTypename, translateStopTypes } from './utils';

describe('Stop registry utils', () => {
  describe('translateStopTypes', () => {
    it('should translate a single stop type', () => {
      const stopPlace = {
        stopType: {
          mainLine: false,
          interchange: false,
          railReplacement: true,
          virtual: false,
        },
      };
      const result = translateStopTypes(stopPlace);
      expect(result).toBe('Raideliikennettä korvaava');
    });

    it('should translate multiple stop types', () => {
      const stopPlace = {
        stopType: {
          mainLine: true,
          interchange: true,
          railReplacement: true,
          virtual: true,
        },
      };
      const result = translateStopTypes(stopPlace);
      expect(result).toBe(
        'Runkolinja, vaihtopysäkki, raideliikennettä korvaava, virtuaalipysäkki',
      );
    });

    it('should return an empty string when stop has no types', () => {
      const stopPlace = {
        stopType: {
          mainLine: false,
          interchange: false,
          railReplacement: false,
          virtual: false,
        },
      };
      const result = translateStopTypes(stopPlace);
      expect(result).toBe('');
    });
  });

  describe('deepStripTypename', () => {
    it('should strip __typename from object and nested objects', () => {
      const gqlObject = {
        __typename: 'typename1',
        property: 'property',
        anotherProperty: {
          innerProperty: 'innerProperty',
          __typename: 'innerTypename',
        },
      };
      const result = deepStripTypename(gqlObject);
      expect(result).toEqual({
        property: 'property',
        anotherProperty: {
          innerProperty: 'innerProperty',
        },
      });
    });

    it('does not crash if object doesnt have typename', () => {
      const gqlObject = {
        property: 'property',
        anotherProperty: {
          innerProperty: 'innerProperty',
        },
      };
      const result = deepStripTypename(gqlObject);
      expect(result).toEqual({
        property: 'property',
        anotherProperty: {
          innerProperty: 'innerProperty',
        },
      });
    });

    it('return the original variable if its not even an object', () => {
      const result = deepStripTypename('just a string');
      expect(result).toEqual('just a string');
    });

    it('should not modify arrays', () => {
      const result = deepStripTypename(['value1', 'value2']);
      expect(result).toEqual(['value1', 'value2']);
    });
  });
});
