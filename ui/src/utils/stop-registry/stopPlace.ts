import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import {
  Maybe,
  StopRegistryAccessibilityLevel,
  StopRegistryAlternativeName,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryKeyValues,
  StopRegistryNameType,
  StopRegistryParentStopPlace,
  StopRegistryQuay,
  StopRegistryStopPlace,
  StopRegistryStopPlaceInput,
} from '../../generated/graphql';
import { hasTypeName } from '../../graphql';
import { StopPlaceState } from '../../types/stop-registry';
import { mapLngLatToPoint } from '../gis';

type StopPlaceType = Pick<StopRegistryStopPlace, '__typename'>;
type ParentStopPlaceType = Pick<StopRegistryParentStopPlace, '__typename'>;

// The items in stop place query result also contain some types that should not be there at all:
// possible null values and parent stop places.
// We want to omit those here since they're not possible.
const isStopPlace = <T extends StopPlaceType>(
  stopPlaceResult: unknown,
): stopPlaceResult is T => {
  return !!(
    (
      hasTypeName(stopPlaceResult) && // Null obviously does not have type name at all.
      // eslint-disable-next-line no-underscore-dangle
      stopPlaceResult.__typename === 'stop_registry_StopPlace'
    ) // For parent type this would be stop_registry_ParentStopPlace
  );
};

/**
 * Takes an array of StopPlace objects from a GraphQL query result.
 * Filters unwanted types from the result, and returns StopPlace objects with correct type.
 */
export const getStopPlacesFromQueryResult = <T extends StopPlaceType>(
  stopPlaceResult:
    | ReadonlyArray<T | ParentStopPlaceType | null>
    | undefined
    | null,
): Array<T> => {
  const stopPlaces = stopPlaceResult ?? [];
  return stopPlaces.filter(isStopPlace<T>);
};

// Required in DB so can't be null.
export const defaultAccessibilityLevel = StopRegistryAccessibilityLevel.Unknown;

export type StopPlaceEnrichmentProperties = {
  nameSwe: string | undefined;
  nameLongFin: string | undefined;
  nameLongSwe: string | undefined;
  abbreviationFin: string | undefined;
  abbreviationSwe: string | undefined;
  abbreviation5CharFin: string | undefined;
  abbreviation5CharSwe: string | undefined;
  name: string | undefined;
  municipality: string | undefined;
  fareZone: string | undefined;
  locationLat: number | undefined;
  locationLong: number | undefined;
  validityStart: string | undefined;
  validityEnd?: string | undefined;
};

export type QuayEnrichmentProperties = {
  readonly elyNumber: string | null;
  readonly locationFin: string | null;
  readonly locationSwe: string | null;
  readonly streetAddress: string | null;
  readonly postalCode: string | null;
  readonly functionalArea: number | null;
  readonly stopState: StopPlaceState | null;
  readonly accessibilityLevel: StopRegistryAccessibilityLevel;
  readonly stopType: {
    readonly mainLine: boolean;
    readonly virtual: boolean;
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

type ElementWithKeyValues = {
  readonly keyValues?: Maybe<Array<Maybe<StopRegistryKeyValues>>>;
};

const findKeyValue = (
  element: ElementWithKeyValues,
  key: string,
): string | null => {
  const keyValue = element.keyValues?.find((kv) => kv?.key === key);
  // Note: the "values" could be an array with many values.
  return keyValue?.values?.[0] ?? null;
};

/**
 * Changes the value of given key in initialKeyValues if the key is found,
 * otherwise adds the key values pair to initialKeyValues
 */
export const setKeyValue = (
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  key: string,
  values: Maybe<string>[],
): (StopRegistryKeyValues | null)[] => {
  const newItem = { key, values };

  const keyValues = initialKeyValues ?? [];
  const existingKeyIndex = keyValues.findIndex(
    (keyValuePair) => keyValuePair?.key === key,
  );

  if (existingKeyIndex >= 0) {
    const copy = keyValues.slice();
    copy[existingKeyIndex] = newItem;
    return copy;
  }

  return keyValues.concat(newItem);
};

export const setMultipleKeyValues = (
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  updates: ReadonlyArray<{ key: string; values: string[] }>,
) => {
  return updates.reduce(
    (acc, { key, values }) => setKeyValue(acc, key, values),
    initialKeyValues?.slice() ?? [],
  );
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
  updates: ReadonlyArray<{ key: string; values: string[] }>,
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
  element: ElementWithKeyValues,
  key: string,
  parser: (arg0: string) => T,
): T | null => {
  const keyValue = findKeyValue(element, key);
  if (keyValue === null) {
    return keyValue;
  }
  return parser(keyValue);
};

type StopRegistryQuayWithoutStopPoint = Omit<
  StopRegistryQuay,
  'scheduled_stop_point'
>;

export const getQuayDetailsForEnrichment = <
  T extends StopRegistryQuayWithoutStopPoint,
>(
  quay: T,
): QuayEnrichmentProperties => {
  return {
    elyNumber: quay.privateCode?.value ?? null,
    locationFin: quay.description?.value ?? null,
    locationSwe:
      findAlternativeName(quay, 'swe', StopRegistryNameType.Other)?.value ??
      null,
    streetAddress: findKeyValue(quay, 'streetAddress'),
    postalCode: findKeyValue(quay, 'postalCode'),
    functionalArea: findKeyValueParsed(quay, 'functionalArea', parseFloat),
    stopState: findKeyValue(quay, 'stopState') as StopPlaceState,
    accessibilityLevel:
      quay.accessibilityAssessment?.hslAccessibilityProperties
        ?.accessibilityLevel ?? defaultAccessibilityLevel,
    stopType: {
      mainLine: findKeyValue(quay, 'mainLine') === 'true',
      virtual: findKeyValue(quay, 'virtual') === 'true',
    },
  };
};

type StopRegistryStopPlaceWithQuays = Omit<StopRegistryStopPlace, 'quays'> & {
  readonly quays?: Maybe<Array<Maybe<StopRegistryQuayWithoutStopPoint>>>;
};

const findCoordinate = (
  stopPlace: StopRegistryStopPlaceWithQuays,
  coordinate: 'latitude' | 'longitude',
): number | undefined => {
  const coordinates = stopPlace.geometry?.coordinates ?? undefined;
  return coordinates ? mapLngLatToPoint(coordinates)[coordinate] : undefined;
};

export const getStopPlaceDetailsForEnrichment = <
  T extends StopRegistryStopPlaceWithQuays,
>(
  stopPlace: T,
): StopPlaceEnrichmentProperties => {
  /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
  return {
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
    municipality: stopPlace.topographicPlace?.name?.value || undefined,
    fareZone: stopPlace.fareZones?.[0]?.name?.value || undefined,
    name: stopPlace.name?.value || undefined,
    locationLat: findCoordinate(stopPlace, 'latitude'),
    locationLong: findCoordinate(stopPlace, 'longitude'),
    validityStart: findKeyValue(stopPlace, 'validityStart') || undefined,
    validityEnd: findKeyValue(stopPlace, 'validityEnd') || undefined,
  };
  /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
};

/**
 * A helper that returns properties which should always be included when updating a stop place.
 * Without these the mutation might have undesired side effects.
 * These can still be overridden in the mutation if needed.
 */
export const getRequiredStopPlaceMutationProperties = <
  T extends StopRegistryStopPlaceWithQuays & StopPlaceEnrichmentProperties,
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
