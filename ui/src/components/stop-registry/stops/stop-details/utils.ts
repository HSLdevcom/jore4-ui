import compact from 'lodash/compact';
import { EnrichedStopPlace } from '../../../../hooks';
import { i18n } from '../../../../i18n';

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
