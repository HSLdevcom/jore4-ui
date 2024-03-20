import {
  StopRegistryEmbeddableMultilingualString,
  StopRegistryNameType,
  StopRegistryParentStopPlace,
  StopRegistryStopPlace,
} from '../../generated/graphql';
import { hasTypeName } from '../../graphql';
import { StopPlaceState } from '../../types/stop-registry';

type StopPlaceType = Pick<StopRegistryStopPlace, '__typename'>;
type ParentStopPlaceType = Pick<StopRegistryParentStopPlace, '__typename'>;

// The items in stop place query result also contain some types that should not be there at all:
// possible null values and parent stop places.
// We want to omit those here since they're not possible.
const isStopPlace = (
  stopPlaceResult: unknown,
): stopPlaceResult is StopPlaceType => {
  return !!(
    (
      hasTypeName(stopPlaceResult) && // Null obviously does not have type name at all.
      // eslint-disable-next-line no-underscore-dangle
      stopPlaceResult.__typename === 'stop_registry_StopPlace'
    ) // For parent type this would be stop_registry_ParentStopPlace
  );
};

/**
 * Takes a StopPlace object from a GraphQL query result.
 * Filters unwanted types from the result, and returns a single StopPlace object with correct type.
 * Expected to be used for queries that return a single StopPlace and not multiple.
 */
export const getStopPlaceFromQueryResult = <T extends StopPlaceType>(
  stopPlaceResult: Array<T | ParentStopPlaceType | null> | undefined | null,
): T | null => {
  // Should be an object but for whatever reason always returns an array.
  const stopPlaces = stopPlaceResult || [];

  if (stopPlaces.length > 1) {
    // Should not happen when querying by id.
    console.warn('Multiple stop places found.', stopPlaces); // eslint-disable-line no-console
  }

  const [stopPlace] = stopPlaces;

  return isStopPlace(stopPlace) ? stopPlace : null;
};

export type StopPlaceEnrichmentProperties = {
  nameFin: string | undefined;
  nameSwe: string | undefined;
  nameLongFin: string | undefined;
  nameLongSwe: string | undefined;
  abbreviationFin: string | undefined;
  abbreviationSwe: string | undefined;
  abbreviation5CharFin: string | undefined;
  abbreviation5CharSwe: string | undefined;
  elyNumber: string | undefined;
  locationFin: string | undefined;
  locationSwe: string | undefined;
  streetAddress: string | undefined;
  postalCode: string | undefined;
  functionalArea: number | undefined;
  stopState: StopPlaceState | undefined;
};

const findAlternativeName = (
  stopPlace: Pick<StopRegistryStopPlace, 'alternativeNames'>,
  lang: string,
  nameType: StopRegistryNameType = StopRegistryNameType.Translation,
): StopRegistryEmbeddableMultilingualString | null => {
  const matchingName = stopPlace.alternativeNames?.find(
    (an) => an?.name.lang === lang && an.nameType === nameType,
  );
  return matchingName?.name || null;
};

const findKeyValue = (
  stopPlace: StopRegistryStopPlace,
  key: string,
): string | undefined => {
  const keyValue = stopPlace.keyValues?.find((kv) => kv?.key === key);
  // Note: the "values" could be an array with many values.
  return (keyValue && keyValue.values?.[0]) || undefined;
};

const findKeyValueParsed = <T = string>(
  stopPlace: StopRegistryStopPlace,
  key: string,
  parser: (arg0: string) => T,
): T | undefined => {
  const keyValue = findKeyValue(stopPlace, key);
  if (keyValue === undefined) {
    return keyValue;
  }
  return parser(keyValue);
};

export const getStopPlaceDetailsForEnrichment = <
  T extends StopRegistryStopPlace,
>(
  stopPlace: T,
): StopPlaceEnrichmentProperties => {
  return {
    nameFin: stopPlace.name?.value || undefined,
    nameSwe:
      findAlternativeName(stopPlace, 'swe', StopRegistryNameType.Translation)
        ?.value || undefined,
    nameLongFin:
      findAlternativeName(stopPlace, 'fin', StopRegistryNameType.Alias)
        ?.value || undefined,
    nameLongSwe:
      findAlternativeName(stopPlace, 'swe', StopRegistryNameType.Alias)
        ?.value || undefined,
    abbreviationFin:
      findAlternativeName(
        stopPlace.quays?.[0] || {},
        'fin',
        StopRegistryNameType.Alias,
      )?.value || undefined,
    abbreviationSwe:
      findAlternativeName(
        stopPlace.quays?.[0] || {},
        'swe',
        StopRegistryNameType.Alias,
      )?.value || undefined,
    abbreviation5CharFin:
      findAlternativeName(stopPlace, 'fin', StopRegistryNameType.Label)
        ?.value || undefined,
    abbreviation5CharSwe:
      findAlternativeName(stopPlace, 'swe', StopRegistryNameType.Label)
        ?.value || undefined,
    elyNumber: stopPlace.privateCode?.value || undefined,
    locationFin: stopPlace.description?.value || undefined,
    locationSwe:
      findAlternativeName(stopPlace, 'swe', StopRegistryNameType.Other)
        ?.value || undefined,
    streetAddress: findKeyValue(stopPlace, 'streetAddress'),
    postalCode: findKeyValue(stopPlace, 'postalCode'),
    functionalArea: findKeyValueParsed(stopPlace, 'functionalArea', parseFloat),
    stopState: findKeyValue(stopPlace, 'state') as StopPlaceState,
  };
};
