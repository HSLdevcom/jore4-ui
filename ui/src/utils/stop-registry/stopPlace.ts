import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import {
  Maybe,
  StopRegistryAccessibilityLevel,
  StopRegistryAlternativeName,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryInterchangeWeightingType,
  StopRegistryKeyValues,
  StopRegistryNameType,
  StopRegistryParentStopPlace,
  StopRegistryStopPlace,
  StopRegistryStopPlaceInput,
  StopRegistrySubmodeType,
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
  const stopPlaces = stopPlaceResult ?? [];

  if (stopPlaces.length > 1) {
    // Should not happen when querying by id.
    console.warn('Multiple stop places found.', stopPlaces); // eslint-disable-line no-console
  }

  const [stopPlace] = stopPlaces;

  return isStopPlace(stopPlace) ? stopPlace : null;
};

// Required in DB so can't be null.
export const defaultAccessibilityLevel = StopRegistryAccessibilityLevel.Unknown;

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
  municipality: string | undefined;
  fareZone: string | undefined;
  functionalArea: number | undefined;
  stopState: StopPlaceState | undefined;
  accessibilityLevel: StopRegistryAccessibilityLevel;
  stopType: {
    mainLine: boolean;
    interchange: boolean;
    railReplacement: boolean;
    virtual: boolean;
  };
};

const findAlternativeName = (
  stopPlace: Pick<StopRegistryStopPlace, 'alternativeNames'>,
  lang: string,
  nameType: StopRegistryNameType = StopRegistryNameType.Translation,
): StopRegistryEmbeddableMultilingualString | null => {
  const matchingName = stopPlace.alternativeNames?.find(
    (an) => an?.name.lang === lang && an.nameType === nameType,
  );
  return matchingName?.name ?? null;
};

export const setAlternativeName = (
  initialAlternativeNames: (StopRegistryAlternativeName | null)[] | undefined,
  newAlternativeName: {
    name: { lang: string; value: string | undefined };
    nameType: StopRegistryNameType;
  },
) => {
  const alternativeNames = cloneDeep(initialAlternativeNames) ?? [];
  const existingAlternativeName = alternativeNames.find(
    (alternativeName) =>
      alternativeName?.nameType === newAlternativeName.nameType &&
      alternativeName?.name.lang === newAlternativeName.name.lang,
  );

  if (existingAlternativeName) {
    existingAlternativeName.name.value = newAlternativeName.name.value;
  } else {
    alternativeNames.push(newAlternativeName);
  }
  return alternativeNames;
};

export const setMultipleAlternativeNames = (
  initialAlternativeNames: (StopRegistryAlternativeName | null)[] | undefined,
  updates: {
    name: { lang: string; value: string | undefined };
    nameType: StopRegistryNameType;
  }[],
) => {
  return updates.reduce((acc, newAlternativeName) => {
    return setAlternativeName(acc, newAlternativeName);
  }, initialAlternativeNames);
};

const findKeyValue = (
  stopPlace: StopRegistryStopPlace,
  key: string,
): string | undefined => {
  const keyValue = stopPlace.keyValues?.find((kv) => kv?.key === key);
  // Note: the "values" could be an array with many values.
  return keyValue?.values?.[0] ?? undefined;
};

/**
 * Changes the value of given key in initialKeyValues if the key is found,
 * otherwise adds the key values pair to initialKeyValues
 */
export const setKeyValue = (
  initialKeyValues: (StopRegistryKeyValues | null)[] | undefined,
  key: string,
  values: Maybe<string>[],
): (StopRegistryKeyValues | null)[] => {
  const keyValues = cloneDeep(initialKeyValues) ?? [];
  const existingKey = keyValues.find(
    (keyValuePair) => keyValuePair?.key === key,
  );
  if (existingKey) {
    existingKey.values = values;
  } else {
    keyValues.push({ key, values });
  }
  return keyValues;
};

export const setMultipleKeyValues = (
  initialKeyValues: (StopRegistryKeyValues | null)[] | undefined,
  updates: { key: string; values: string[] }[],
) => {
  return updates.reduce((acc, { key, values }) => {
    return setKeyValue(acc, key, values);
  }, initialKeyValues);
};

// TODO: This typename omit can be avoided completely by using
// newer version of apollo client and then adding removeTypenameFromVariables link
// but that currently causes a random cache desync with timing settings dropdown
// so lets just use these omits for now and replace them in an individual PR
// where we upgrade apollo client to > 3.8
const omitTypename = <T extends { __typename?: string } | null>(
  obj: T,
): Omit<T, '__typename'> => {
  return obj && omit(obj, '__typename');
};

export const patchKeyValues = (
  stopPlace: Pick<StopRegistryStopPlace, 'keyValues'> | null,
  updates: { key: string; values: string[] }[],
) => {
  const initialKeyValues =
    stopPlace?.keyValues?.map((keyValue) => omitTypename(keyValue)) ?? [];

  return setMultipleKeyValues(initialKeyValues, updates);
};

export const patchAlternativeNames = (
  stopPlace: Pick<StopRegistryStopPlace, 'alternativeNames'> | null,
  updates: {
    name: { lang: string; value: string | undefined };
    nameType: StopRegistryNameType;
  }[],
) => {
  const initialAlternativeNames = stopPlace?.alternativeNames?.map(
    (alternativeName) =>
      alternativeName && {
        name: omitTypename(alternativeName.name),
        nameType: alternativeName.nameType,
      },
  );

  return setMultipleAlternativeNames(initialAlternativeNames, updates);
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
  /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
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
        stopPlace.quays?.[0] ?? {},
        'fin',
        StopRegistryNameType.Alias,
      )?.value || undefined,
    abbreviationSwe:
      findAlternativeName(
        stopPlace.quays?.[0] ?? {},
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
    municipality: stopPlace.topographicPlace?.name?.value || undefined,
    fareZone: stopPlace.fareZones?.[0]?.name?.value || undefined,
    functionalArea: findKeyValueParsed(stopPlace, 'functionalArea', parseFloat),
    stopState: findKeyValue(stopPlace, 'stopState') as StopPlaceState,
    accessibilityLevel:
      stopPlace.accessibilityAssessment?.hslAccessibilityProperties
        ?.accessibilityLevel ?? defaultAccessibilityLevel,
    stopType: {
      mainLine: findKeyValue(stopPlace, 'mainLine') === 'true',
      interchange:
        stopPlace.weighting ===
        StopRegistryInterchangeWeightingType.RecommendedInterchange,
      railReplacement:
        stopPlace.submode === StopRegistrySubmodeType.RailReplacementBus,
      virtual: findKeyValue(stopPlace, 'virtual') === 'true',
    },
  };
  /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
};

/**
 * A helper that returns properties which should always be included when updating a stop place.
 * Without these the mutation might have undesired side effects.
 * These can still be overridden in the mutation if needed.
 */
export const getRequiredStopPlaceMutationProperties = <
  T extends StopRegistryStopPlace & StopPlaceEnrichmentProperties,
>(
  stopPlace: T | null,
): Partial<StopRegistryStopPlaceInput> => {
  if (!stopPlace) {
    return {};
  }

  return {
    // Needs to be included because otherwise the mutation will clear this field.
    // This feels like a bug in Tiamat. If that ever gets fixed, this can be removed.
    description: stopPlace.description && omitTypename(stopPlace.description),
  };
};
