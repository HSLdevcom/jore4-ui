import compact from 'lodash/compact';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {
  InputMaybe,
  Maybe,
  StopRegistryAccessibilityAssessment,
  StopRegistryAccessibilityAssessmentInput,
  StopRegistryAlternativeName,
  StopRegistryAlternativeNameInput,
  StopRegistryExternalLink,
  StopRegistryExternalLinkInput,
  StopRegistryGeneralSign,
  StopRegistryGeneralSignInput,
  StopRegistryGeoJson,
  StopRegistryGeoJsonInput,
  StopRegistryLimitationStatusType,
  StopRegistryPlaceEquipments,
  StopRegistryPlaceEquipmentsInput,
  StopRegistryPrivateCode,
  StopRegistryPrivateCodeInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRefInput,
} from '../../../generated/graphql';

export function omitTypeName<T extends object>(
  value: T | null | undefined,
): Omit<T, '__typename'> | null {
  if (!value) {
    return null;
  }

  return omit(value, ['__typename']) as Omit<T, '__typename'>;
}

export function omitIdAndTypeName<T extends object>(
  value: T | null | undefined,
): Omit<T, 'id' | '__typename'> | null {
  if (!value) {
    return null;
  }

  return omit(value, ['id', '__typename']) as Omit<T, 'id' | '__typename'>;
}

export function mapGeoJsonToInput(
  geoJson: StopRegistryGeoJson | null | undefined,
): InputMaybe<StopRegistryGeoJsonInput> {
  if (!geoJson || !geoJson.coordinates || !geoJson.type) {
    return null;
  }

  return {
    coordinates: geoJson.coordinates,
    type: geoJson.type,
  };
}

/**
 * Map effed up Timat output type to valid input
 *
 * - Filter out nulls from OutputType/input arrays.
 * - Map remaining defined objects
 * - Filter out any potential nulls produced by mapper
 * - Finally if resulting InputType/output array is empty,
 *   return null instead.
 *
 * @param array Input array of OutputType T entities
 * @param mapper Mapper function OutputType T to InputType R
 */
export function mapCompactOrNull<T, R>(
  array: ReadonlyArray<T | null | undefined> | null | undefined,
  mapper: (item: T) => R | null,
): Array<R> | null {
  if (!array) {
    return null;
  }

  const compactedInput = compact(array);
  const mapped = compactedInput.map(mapper);
  const compactedOutput = compact(mapped);

  return compactedOutput.length ? compactedOutput : null;
}

export function mapAlternativeNames(
  alternativeNames:
    | ReadonlyArray<Maybe<StopRegistryAlternativeName>>
    | null
    | undefined,
): Array<StopRegistryAlternativeNameInput> | null {
  return mapCompactOrNull(alternativeNames, (alt) => ({
    name: { lang: alt.name.lang, value: alt.name.value },
    nameType: alt.nameType,
  }));
}

export function mapAccessibilityAssessmentToInput(
  originalAccessibilityAssessment:
    | StopRegistryAccessibilityAssessment
    | null
    | undefined,
): InputMaybe<StopRegistryAccessibilityAssessmentInput> {
  if (!originalAccessibilityAssessment) {
    return null;
  }

  const { limitations, hslAccessibilityProperties } =
    originalAccessibilityAssessment;

  return {
    hslAccessibilityProperties: omitTypeName(hslAccessibilityProperties),
    limitations: limitations
      ? {
          audibleSignalsAvailable:
            limitations.audibleSignalsAvailable ??
            StopRegistryLimitationStatusType.Unknown,
          escalatorFreeAccess:
            limitations.escalatorFreeAccess ??
            StopRegistryLimitationStatusType.Unknown,
          liftFreeAccess:
            limitations.liftFreeAccess ??
            StopRegistryLimitationStatusType.Unknown,
          stepFreeAccess:
            limitations.stepFreeAccess ??
            StopRegistryLimitationStatusType.Unknown,
          wheelchairAccess:
            limitations.wheelchairAccess ??
            StopRegistryLimitationStatusType.Unknown,
        }
      : null,
  };
}

export function mapPrivateCodeToInput(
  privateCode: StopRegistryPrivateCode | null | undefined,
): InputMaybe<StopRegistryPrivateCodeInput> {
  if (!privateCode || !privateCode.value) {
    return null;
  }

  return {
    type: privateCode.type,
    value: privateCode.value,
  };
}

function mapGeneralSignToInput(
  generalSign: StopRegistryGeneralSign | null | undefined,
): InputMaybe<StopRegistryGeneralSignInput> {
  if (!generalSign) {
    return null;
  }

  return {
    ...pick(generalSign, [
      'lineSignage',
      'mainLineSign',
      'numberOfFrames',
      'replacesRailSign',
      'signContentType',
    ]),
    content: omitTypeName(generalSign.content),
    note: omitTypeName(generalSign.note),
    privateCode: mapPrivateCodeToInput(generalSign.privateCode),
  };
}

export function mapPlaceEquipmentsToInput(
  equipments: StopRegistryPlaceEquipments | null | undefined,
): InputMaybe<StopRegistryPlaceEquipmentsInput> {
  if (!equipments) {
    return null;
  }

  return {
    cycleStorageEquipment: mapCompactOrNull(
      equipments.cycleStorageEquipment,
      omitIdAndTypeName,
    ),
    generalSign: mapCompactOrNull(
      equipments.generalSign,
      mapGeneralSignToInput,
    ),
    sanitaryEquipment: mapCompactOrNull(
      equipments.sanitaryEquipment,
      omitIdAndTypeName,
    ),
    shelterEquipment: mapCompactOrNull(
      equipments.shelterEquipment,
      omitIdAndTypeName,
    ),
    ticketingEquipment: mapCompactOrNull(
      equipments.ticketingEquipment,
      omitIdAndTypeName,
    ),
    waitingRoomEquipment: mapCompactOrNull(
      equipments.waitingRoomEquipment,
      omitIdAndTypeName,
    ),
  };
}

export function mapExternalLinks(
  externalLinks:
    | ReadonlyArray<Maybe<StopRegistryExternalLink>>
    | null
    | undefined,
): Array<StopRegistryExternalLinkInput> | null {
  return mapCompactOrNull(externalLinks, (link) => ({
    name: link.name,
    location: link.location,
  }));
}

export function mapOrganisations(
  organisations:
    | ReadonlyArray<Maybe<StopRegistryStopPlaceOrganisationRef>>
    | null
    | undefined,
): Array<StopRegistryStopPlaceOrganisationRefInput> | null {
  return mapCompactOrNull(organisations, (org) => ({
    organisationRef: org.organisationRef,
    relationshipType: org.relationshipType,
  }));
}
