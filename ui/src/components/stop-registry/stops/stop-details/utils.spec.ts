// i18n does export a TYPE called i18n, wich throws the import plugin off.
// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next';
import '../../../../i18n';
import { optionalBooleanToUiText, translateStopTypes } from './utils';

describe('Stop registry utils', () => {
  describe('translateStopTypes', () => {
    it('should translate a single stop type', () => {
      const stopPlace = {
        stopType: {
          railReplacement: true,
          virtual: false,
        },
      };
      const result = translateStopTypes(i18n.t, stopPlace);
      expect(result).toBe('Raideliikennettä korvaava');
    });

    it('should translate multiple stop types', () => {
      const stopPlace = {
        stopType: {
          railReplacement: true,
          virtual: true,
        },
      };
      const result = translateStopTypes(i18n.t, stopPlace);
      expect(result).toBe('Raideliikennettä korvaava, virtuaalipysäkki');
    });

    it('should return an empty string when stop has no types', () => {
      const stopPlace = {
        stopType: {
          railReplacement: false,
          virtual: false,
        },
      };
      const result = translateStopTypes(i18n.t, stopPlace);
      expect(result).toBe('');
    });
  });

  describe('optionalBooleanToUiText', () => {
    it('should translate true', () => {
      const result = optionalBooleanToUiText(i18n.t, true);
      expect(result).toBe('Kyllä');
    });

    it('should translate false', () => {
      const result = optionalBooleanToUiText(i18n.t, false);
      expect(result).toBe('Ei');
    });

    it('should not translate undefined', () => {
      const result = optionalBooleanToUiText(i18n.t, undefined);
      expect(result).toBe(undefined);
    });

    it('should not translate null', () => {
      const result = optionalBooleanToUiText(i18n.t, null);
      expect(result).toBe(undefined);
    });
  });
});
