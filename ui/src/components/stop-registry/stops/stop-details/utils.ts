import compact from 'lodash/compact';
import { EnrichedStopPlace } from '../../../../hooks';
import { i18n } from '../../../../i18n';
import translationsFi from '../../../../locales/fi-FI/common.json';

/**
 * Returns a translated string that includes all stop types of a given stop place.
 */
export const translateStopTypes = (
  stopPlace: Pick<EnrichedStopPlace, 'stopType'>,
) => {
  const result = compact([
    stopPlace.stopType.mainLine && i18n.t('stopPlaceTypes.mainLine'),
    stopPlace.stopType.interchange && i18n.t('stopPlaceTypes.interchange'),
    stopPlace.stopType.railReplacement &&
      i18n.t('stopPlaceTypes.railReplacement'),
    stopPlace.stopType.virtual && i18n.t('stopPlaceTypes.virtual'),
  ])
    // Uncapitalize each translation.
    .map((stopType) => stopType.charAt(0).toLowerCase() + stopType.slice(1))
    .join(', ');

  // Capitalize the final result.
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Maps a boolean to a translated yes/no text.
 *
 * Missing values are NOT translated.
 */
export const optionalBooleanToUiText = (
  value: boolean | undefined | null,
  translations: { true: string; false: string } = {
    true: i18n.t('yes'),
    false: i18n.t('no'),
  },
) => {
  if (value) {
    return translations.true;
  }
  if (value === false) {
    return translations.false;
  }
  return undefined;
};

// Element implicitly has an 'any' type because expression of type 'string' can't be used to index type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedTranslation = (path: string, obj: any) => {
  return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
};

/**
 * Maps strings to translated texts.
 *
 * Missing values are NOT translated.
 */
export const valueToUiText = (
  value: string | undefined | null,
  stringTranslations: { [key: string]: string } = translationsFi.stopDetails
    .infoSpots,
) => {
  if (typeof value === 'string') {
    const translation = getNestedTranslation(value, stringTranslations);
    if (translation) {
      return translation;
    }
  }
  return undefined;
};

export const formatDimension = (dimension: string | undefined | null) => {
  // Extract the numerical part from the string
  const match = dimension?.match(/^cm(\d+x\d+)$/);

  if (!match) {
    return dimension;
  }

  // Extract the dimension part
  const extractedDimension = match[1];

  // Return the reformatted string
  return `${extractedDimension}cm`;
};
