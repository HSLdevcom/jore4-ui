import {
  StopRegistryEmbeddableMultilingualString,
  StopRegistryNameType,
  StopRegistryParentStopPlace,
  StopRegistryStopPlace,
} from '../../generated/graphql';
import { hasTypeName } from '../../graphql';

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
  finnishName: string | undefined;
  swedishName: string | undefined;
};

const findAlternativeName = (
  stopPlace: StopRegistryStopPlace,
  lang: string,
  nameType: StopRegistryNameType = StopRegistryNameType.Translation,
): StopRegistryEmbeddableMultilingualString | null => {
  const matchingName = stopPlace.alternativeNames?.find(
    (an) => an?.name.lang === lang && an.nameType === nameType,
  );
  return matchingName?.name || null;
};

export const getStopPlaceDetailsForEnrichment = <
  T extends StopRegistryStopPlace,
>(
  stopPlace: T,
): StopPlaceEnrichmentProperties => {
  return {
    finnishName: stopPlace.name?.value || undefined,
    swedishName: findAlternativeName(stopPlace, 'swe')?.value || undefined,
  };
};
