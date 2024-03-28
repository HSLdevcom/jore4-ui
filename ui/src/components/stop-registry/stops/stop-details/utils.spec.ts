import { optionalBooleanToUiText, translateStopTypes } from './utils';

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

  describe('optionalBooleanToUiText', () => {
    it('should translate true', () => {
      const result = optionalBooleanToUiText(true);
      expect(result).toBe('Kyllä');
    });

    it('should translate false', () => {
      const result = optionalBooleanToUiText(false);
      expect(result).toBe('Ei');
    });

    it('should not translate undefined', () => {
      const result = optionalBooleanToUiText(undefined);
      expect(result).toBe(undefined);
    });

    it('should not translate null', () => {
      const result = optionalBooleanToUiText(null);
      expect(result).toBe(undefined);
    });
  });
});
