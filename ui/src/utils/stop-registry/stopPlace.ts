import omit from 'lodash/omit';
import {
  AccessibilityAssessmentDetailsFragment,
  Maybe,
  StopRegistryAccessibilityLevel,
  StopRegistryAlternativeName,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryGeoJson,
  StopRegistryKeyValues,
  StopRegistryNameType,
  StopRegistryParentStopPlace,
  StopRegistryQuay,
  StopRegistryStopPlace,
  StopRegistryStopPlaceInput,
  StopRegistryStopPlaceOrganisationRelationshipType,
  StopRegistryTopographicPlaceType,
} from '../../generated/graphql';
import { hasTypeName } from '../../graphql';
import {
  ParentStopPlaceEnrichmentProperties,
  ParentStopPlaceOwner,
  QuayEnrichmentProperties,
  SharedEnrichmentProperties,
} from '../../types';
import { Priority, knownPriorityValues } from '../../types/enums';
import { StopPlaceState } from '../../types/stop-registry';
import { findKeyValue, findKeyValueParsed } from '../findKeyValue';
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

const isParentStopPlace = <T extends ParentStopPlaceType>(
  stopPlaceResult: unknown,
): stopPlaceResult is T => {
  return !!(
    hasTypeName(stopPlaceResult) && // Null obviously does not have type name at all.
    // eslint-disable-next-line no-underscore-dangle
    stopPlaceResult.__typename === 'stop_registry_ParentStopPlace'
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

export const getParentStopPlacesFromQueryResult = <
  T extends ParentStopPlaceType,
>(
  parentStopPlaceResult:
    | ReadonlyArray<T | StopPlaceType | null>
    | undefined
    | null,
): Array<T> => {
  const parentStopPlaces = parentStopPlaceResult ?? [];
  return parentStopPlaces.filter(isParentStopPlace<T>);
};

// Required in DB so can't be null.
export const defaultAccessibilityLevel = StopRegistryAccessibilityLevel.Unknown;

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
  initialAlternativeNames:
    | ReadonlyArray<StopRegistryAlternativeName | null>
    | undefined,
  newAlternativeName: {
    name: { lang: string; value: string | undefined };
    nameType: StopRegistryNameType;
  },
) => {
  const alternativeNames = initialAlternativeNames ?? [];
  const existingAlternativeNameIndex = alternativeNames.findIndex(
    (alternativeName) =>
      alternativeName?.nameType === newAlternativeName.nameType &&
      alternativeName?.name.lang === newAlternativeName.name.lang,
  );

  if (existingAlternativeNameIndex >= 0) {
    return alternativeNames.with(
      existingAlternativeNameIndex,
      newAlternativeName,
    );
  }

  return alternativeNames.concat(newAlternativeName);
};

export const setMultipleAlternativeNames = (
  initialAlternativeNames:
    | ReadonlyArray<StopRegistryAlternativeName | null>
    | undefined,
  updates: {
    name: { lang: string; value: string | undefined };
    nameType: StopRegistryNameType;
  }[],
) => {
  return updates.reduce((acc, newAlternativeName) => {
    return setAlternativeName(acc, newAlternativeName);
  }, initialAlternativeNames);
};

/**
 * Changes the value of given key in initialKeyValues if the key is found,
 * otherwise adds the key values pair to initialKeyValues
 */
export function setKeyValue(
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues>,
  key: string,
  values: ReadonlyArray<string>,
): StopRegistryKeyValues[];
export function setKeyValue(
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  key: string,
  values: ReadonlyArray<string>,
): (StopRegistryKeyValues | null)[];
export function setKeyValue(
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  key: string,
  values: ReadonlyArray<string>,
): (StopRegistryKeyValues | null)[] {
  const newItem = { key, values };

  const keyValues = initialKeyValues ?? [];
  const existingKeyIndex = keyValues.findIndex(
    (keyValuePair) => keyValuePair?.key === key,
  );

  if (existingKeyIndex >= 0) {
    return keyValues.with(existingKeyIndex, newItem);
  }

  return keyValues.concat(newItem);
}

export function setMultipleKeyValues(
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues>,
  updates: ReadonlyArray<{ key: string; values: ReadonlyArray<string> }>,
): StopRegistryKeyValues[];
export function setMultipleKeyValues(
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  updates: ReadonlyArray<{ key: string; values: ReadonlyArray<string> }>,
): (StopRegistryKeyValues | null)[];
export function setMultipleKeyValues(
  initialKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  updates: ReadonlyArray<{ key: string; values: ReadonlyArray<string> }>,
): (StopRegistryKeyValues | null)[] {
  return updates.reduce(
    (acc, { key, values }) => setKeyValue(acc, key, values),
    initialKeyValues?.slice() ?? [],
  );
}

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
  stopPlace: {
    readonly keyValues?: Maybe<ReadonlyArray<Maybe<StopRegistryKeyValues>>>;
  } | null,
  updates: ReadonlyArray<{ key: string; values: ReadonlyArray<string> }>,
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

type StopRegistryQuayWithoutStopPoint = Omit<
  StopRegistryQuay,
  'scheduled_stop_point'
>;

export const getQuayDetailsForEnrichment = <
  T extends StopRegistryQuayWithoutStopPoint,
>(
  quay: T,
  accessibilityAssessment:
    | AccessibilityAssessmentDetailsFragment
    | null
    | undefined,
): QuayEnrichmentProperties => {
  const rawPriorityNumber = Number(findKeyValue(quay, 'priority'));

  return {
    elyNumber: findKeyValue(quay, 'elyNumber'),
    privateCode: quay.privateCode?.value ?? null,
    locationFin: quay.description?.value ?? null,
    locationSwe:
      findAlternativeName(quay, 'swe', StopRegistryNameType.Other)?.value ??
      null,
    streetAddress: findKeyValue(quay, 'streetAddress'),
    postalCode: findKeyValue(quay, 'postalCode'),
    functionalArea: findKeyValueParsed(quay, 'functionalArea', parseFloat),
    platformNumber:
      quay.placeEquipments?.generalSign?.[0]?.content?.value ?? null,
    stopState: findKeyValue(quay, 'stopState') as StopPlaceState,
    accessibilityLevel:
      quay.accessibilityAssessment?.hslAccessibilityProperties
        ?.accessibilityLevel ??
      accessibilityAssessment?.hslAccessibilityProperties?.accessibilityLevel ??
      defaultAccessibilityLevel,
    stopType: {
      virtual: findKeyValue(quay, 'virtual') === 'true',
      railReplacement: findKeyValue(quay, 'railReplacement') === 'true',
    },
    validityStart: findKeyValue(quay, 'validityStart'),
    validityEnd: findKeyValue(quay, 'validityEnd'),
    priority: knownPriorityValues.includes(rawPriorityNumber)
      ? (rawPriorityNumber as Priority)
      : null,
  };
};

type StopRegistryStopPlaceWithQuays = Omit<StopRegistryStopPlace, 'quays'> & {
  readonly quays?: Maybe<
    ReadonlyArray<Maybe<StopRegistryQuayWithoutStopPoint>>
  >;
};

const findCoordinate = (
  stopPlace: StopRegistryStopPlaceWithQuays | StopRegistryParentStopPlace,
  coordinate: 'latitude' | 'longitude',
): number | undefined => {
  const coordinates = stopPlace.geometry?.coordinates ?? undefined;
  return coordinates ? mapLngLatToPoint(coordinates)[coordinate] : undefined;
};

// Mark all keys as required, but allow undefined as value.
type ObjectWithAllKeyosOfStopPlaceEnrichmentProperties = {
  [K in keyof Required<SharedEnrichmentProperties>]: SharedEnrichmentProperties[K];
};

type ObjectWithAllKeyosOfParentStopPlaceEnrichmentProperties = {
  [K in keyof Required<ParentStopPlaceEnrichmentProperties>]: ParentStopPlaceEnrichmentProperties[K];
};

const extractSharedStopPlaceDetails = (stopPlace: {
  alternativeNames?: Maybe<ReadonlyArray<Maybe<StopRegistryAlternativeName>>>;
  name?: Maybe<StopRegistryEmbeddableMultilingualString>;
  geometry?: Maybe<StopRegistryGeoJson>;
  keyValues?: Maybe<ReadonlyArray<Maybe<StopRegistryKeyValues>>>;
}): Partial<SharedEnrichmentProperties> => {
  return {
    nameSwe:
      findAlternativeName(stopPlace, 'swe', StopRegistryNameType.Translation)
        ?.value ?? undefined,
    nameEng:
      findAlternativeName(stopPlace, 'eng', StopRegistryNameType.Translation)
        ?.value ?? undefined,
    nameLongFin:
      findAlternativeName(stopPlace, 'fin', StopRegistryNameType.Alias)
        ?.value ?? undefined,
    nameLongSwe:
      findAlternativeName(stopPlace, 'swe', StopRegistryNameType.Alias)
        ?.value ?? undefined,
    nameLongEng:
      findAlternativeName(stopPlace, 'eng', StopRegistryNameType.Alias)
        ?.value ?? undefined,
    abbreviationFin:
      findAlternativeName(stopPlace, 'fin', StopRegistryNameType.Other)
        ?.value ?? undefined,
    abbreviationSwe:
      findAlternativeName(stopPlace, 'swe', StopRegistryNameType.Other)
        ?.value ?? undefined,
    abbreviationEng:
      findAlternativeName(stopPlace, 'eng', StopRegistryNameType.Other)
        ?.value ?? undefined,
    name: stopPlace.name?.value ?? undefined,
    locationLat: findCoordinate(stopPlace, 'latitude'),
    locationLong: findCoordinate(stopPlace, 'longitude'),
    validityStart: findKeyValue(stopPlace, 'validityStart') ?? undefined,
    validityEnd: findKeyValue(stopPlace, 'validityEnd') ?? undefined,
  };
};

export const getStopPlaceDetailsForEnrichment = <
  T extends StopRegistryStopPlaceWithQuays,
>(
  stopPlace: T,
): ObjectWithAllKeyosOfStopPlaceEnrichmentProperties => {
  return {
    ...extractSharedStopPlaceDetails(stopPlace),
    municipality:
      stopPlace.topographicPlace?.topographicPlaceType ===
      StopRegistryTopographicPlaceType.Municipality
        ? (stopPlace.topographicPlace.name?.value ?? undefined)
        : undefined,
    fareZone: stopPlace.fareZones?.[0]?.name?.value ?? undefined,
  } as ObjectWithAllKeyosOfStopPlaceEnrichmentProperties;
};

function findParentStopPlaceOwnerDetails(
  parentStopPlace: StopRegistryParentStopPlace,
): ParentStopPlaceOwner | null {
  const ownerOrg = parentStopPlace.organisations?.find(
    (org) =>
      org?.relationshipType ===
      StopRegistryStopPlaceOrganisationRelationshipType.Owner,
  );

  if (!ownerOrg || !ownerOrg.organisation) {
    return null;
  }

  return {
    organizationRef: ownerOrg.organisationRef,
    name: ownerOrg.organisation.name ?? null,
    email: ownerOrg.organisation.privateContactDetails?.email ?? null,
    phone: ownerOrg.organisation.privateContactDetails?.phone ?? null,
    contractId: findKeyValue(parentStopPlace, 'owner-contractId'),
    note: findKeyValue(parentStopPlace, 'owner-note'),
  };
}

export const getParentStopPlaceDetailsForEnrichment = <
  T extends StopRegistryParentStopPlace,
>(
  parentStopPlace: T,
): ObjectWithAllKeyosOfParentStopPlaceEnrichmentProperties => {
  return {
    ...extractSharedStopPlaceDetails(parentStopPlace),
    municipality: parentStopPlace.topographicPlace?.name?.value ?? undefined,
    streetAddress: findKeyValue(parentStopPlace, 'streetAddress') ?? undefined,
    postalCode: findKeyValue(parentStopPlace, 'postalCode') ?? undefined,
    fareZone: parentStopPlace.fareZones?.at(0)?.name?.value ?? undefined,
    departurePlatforms:
      findKeyValue(parentStopPlace, 'departurePlatforms') ?? undefined,
    arrivalPlatforms:
      findKeyValue(parentStopPlace, 'arrivalPlatforms') ?? undefined,
    loadingPlatforms:
      findKeyValue(parentStopPlace, 'loadingPlatforms') ?? undefined,
    electricCharging:
      findKeyValue(parentStopPlace, 'electricCharging') ?? undefined,
    terminalType: findKeyValue(parentStopPlace, 'terminalType') ?? undefined,
    owner: findParentStopPlaceOwnerDetails(parentStopPlace),
  } as ObjectWithAllKeyosOfParentStopPlaceEnrichmentProperties;
};

/**
 * A helper that returns properties which should always be included when updating a stop place.
 * Without these the mutation might have undesired side effects.
 * These can still be overridden in the mutation if needed.
 */
export const getRequiredStopPlaceMutationProperties = <
  T extends StopRegistryStopPlaceWithQuays & SharedEnrichmentProperties,
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
