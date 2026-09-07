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
import { mapCompactOrNull } from '../../../utils';

export function omitTypeName<T extends object>(
  value: T | null | undefined,
): Omit<T, '__typename'> | null {
  if (!value) {
    return null;
  }

  return omit(value, ['__typename']) as Omit<T, '__typename'>;
}

export function omitIdVersionAndTypeName<T extends object>(
  value: T | null | undefined,
): Omit<T, 'id' | 'version' | '__typename'> | null {
  if (!value) {
    return null;
  }

  return omit(value, ['id', 'version', '__typename']) as Omit<
    T,
    'id' | 'version' | '__typename'
  >;
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

export function mapAlternativeNames(
  alternativeNames:
    ReadonlyArray<Maybe<StopRegistryAlternativeName>> | null | undefined,
): Array<StopRegistryAlternativeNameInput> | null {
  return mapCompactOrNull(alternativeNames, (alt) => ({
    name: { lang: alt.name.lang, value: alt.name.value },
    nameType: alt.nameType,
  }));
}

export function mapAccessibilityAssessmentToInput(
  originalAccessibilityAssessment:
    StopRegistryAccessibilityAssessment | null | undefined,
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
      omitIdVersionAndTypeName,
    ),
    generalSign: mapCompactOrNull(
      equipments.generalSign,
      mapGeneralSignToInput,
    ),
    sanitaryEquipment: mapCompactOrNull(
      equipments.sanitaryEquipment,
      omitIdVersionAndTypeName,
    ),
    shelterEquipment: mapCompactOrNull(
      equipments.shelterEquipment,
      omitIdVersionAndTypeName,
    ),
    ticketingEquipment: mapCompactOrNull(
      equipments.ticketingEquipment,
      omitIdVersionAndTypeName,
    ),
    waitingRoomEquipment: mapCompactOrNull(
      equipments.waitingRoomEquipment,
      omitIdVersionAndTypeName,
    ),
  };
}

export function mapExternalLinks(
  externalLinks:
    ReadonlyArray<Maybe<StopRegistryExternalLink>> | null | undefined,
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
