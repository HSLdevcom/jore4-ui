import i18next from 'i18next';
import { getNameFromAlternatives } from './alternativeNames';

jest.mock('i18next');

const defaultName = 'finName';
const defaultLang = 'fin';

const finnishAlternative = { name_lang: defaultLang, name_value: defaultName };
const swedishAlternative = { name_lang: 'swe', name_value: 'sweName' };
const englishAlternative = { name_lang: 'eng', name_value: 'engName' };
const norwegianAlternative = { name_lang: 'nor', name_value: 'norName' };

const alternatives = [
  swedishAlternative,
  englishAlternative,
  norwegianAlternative,
];

describe('getNameFromAlternatives', () => {
  beforeEach(() => {
    i18next.language = defaultLang;
  });

  describe('Default name given and should return it', () => {
    it('Only default name given', () => {
      expect(getNameFromAlternatives(defaultName, null, null)).toBe(
        defaultName,
      );
    });

    it('Only default name and default lang given', () => {
      expect(getNameFromAlternatives(defaultName, defaultLang, null)).toBe(
        defaultName,
      );
    });

    it('Only default name and other lang given', () => {
      expect(getNameFromAlternatives(defaultName, 'swe', null)).toBe(
        defaultName,
      );
    });

    it('Default name and default lang given with alternatives', () => {
      expect(
        getNameFromAlternatives(defaultName, defaultLang, alternatives),
      ).toBe(defaultName);
    });
  });

  describe('Default name given, but should return alternative', () => {
    it('Wanted name is in alternatives', () => {
      i18next.language = 'en-US';

      expect(
        getNameFromAlternatives(defaultName, defaultLang, alternatives),
      ).toBe('engName');
    });
  });

  describe('No default name given', () => {
    it('Should return null when there is no default nor alternatives', () => {
      expect(getNameFromAlternatives(null, null, null)).toBeNull();
    });

    it('Should return null when there is no default nor a valid alternative', () => {
      expect(
        getNameFromAlternatives(null, null, [norwegianAlternative]),
      ).toBeNull();
    });

    it('Should return alternative when available', () => {
      i18next.language = 'en-US';

      expect(getNameFromAlternatives(null, null, alternatives)).toBe('engName');
    });
  });

  describe('Should respect fallback order', () => {
    describe('If language is Finnish', () => {
      it('Should fallback to Swedish then English', () => {
        expect(getNameFromAlternatives(null, null, alternatives)).toBe(
          'sweName',
        );
        expect(
          getNameFromAlternatives(null, null, [
            norwegianAlternative,
            englishAlternative,
          ]),
        ).toBe('engName');
      });
    });

    describe('If language is English', () => {
      it('Should fallback to Finnish then Swedish', () => {
        i18next.language = 'en-US';

        expect(
          getNameFromAlternatives(null, null, [
            norwegianAlternative,
            swedishAlternative,
            finnishAlternative,
          ]),
        ).toBe('finName');
        expect(
          getNameFromAlternatives(null, null, [
            norwegianAlternative,
            swedishAlternative,
          ]),
        ).toBe('sweName');
      });
    });
  });
});
