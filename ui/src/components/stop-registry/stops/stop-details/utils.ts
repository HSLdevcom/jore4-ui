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

// TODO: how to type this correctly?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepStripTypename = (obj: any) => {
  // TODO: is this safe enough?
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const newObj = { ...obj };
    // eslint-disable-next-line no-underscore-dangle
    delete newObj.__typename;

    Object.keys(newObj).forEach((key) => {
      const property = newObj[key];
      if (typeof property === 'object') {
        newObj[key] = deepStripTypename(property);
      }
    });

    return newObj;
  }
  return obj;
};
