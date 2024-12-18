import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {
  InfoSpotDetailsFragment,
  InputMaybe,
  Maybe,
  StopRegistryAccessibilityAssessment,
  StopRegistryAccessibilityAssessmentInput,
  StopRegistryAlternativeName,
  StopRegistryAlternativeNameInput,
  StopRegistryBoardingPosition,
  StopRegistryBoardingPositionInput,
  StopRegistryGeneralSign,
  StopRegistryGeneralSignInput,
  StopRegistryGeoJson,
  StopRegistryGeoJsonInput,
  StopRegistryInfoSpotInput,
  StopRegistryLimitationStatusType,
  StopRegistryPlaceEquipments,
  StopRegistryPlaceEquipmentsInput,
  StopRegistryPrivateCode,
  StopRegistryPrivateCodeInput,
  StopRegistryQuay,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRefInput,
  StopRegistryTariffZone,
  StopRegistryVersionLessEntityRef,
  StopRegistryVersionLessEntityRefInput,
} from '../../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../../hooks';
import { mapCompactOrNull } from './mapCompactOrNull';

function omitTypeName<T extends object>(
  value: T | null | undefined,
): Omit<T, '__typename'> | null {
  if (!value) {
    return null;
  }

  return omit(value, ['__typename']) as Omit<T, '__typename'>;
}

function omitIdAndTypeName<T extends object>(
  value: T | null | undefined,
): Omit<T, 'id' | '__typename'> | null {
  if (!value) {
    return null;
  }

  return omit(value, ['id', '__typename']) as Omit<T, 'id' | '__typename'>;
}

function mapGeoJsonToInput(
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

function mapAccessibilityAssessmentToInput(
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

function mapPrivateCodeToInput(
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

function mapPlaceEquipmentsToInput(
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

function mapBoardingPositionsToInput(
  positions:
    | ReadonlyArray<Maybe<StopRegistryBoardingPosition>>
    | null
    | undefined,
): Array<StopRegistryBoardingPositionInput> | null {
  return mapCompactOrNull(positions, (position) => ({
    geometry: mapGeoJsonToInput(position.geometry),
    publicCode: position.publicCode,
  }));
}

function mapAdjacentSitesToInput(
  adjacentSites:
    | ReadonlyArray<Maybe<StopRegistryVersionLessEntityRef>>
    | null
    | undefined,
): Array<StopRegistryVersionLessEntityRefInput> | null {
  return mapCompactOrNull(adjacentSites, (site) =>
    site?.ref ? { ref: site.ref } : null,
  );
}

const mapTariffZonesToInput = (
  refs: ReadonlyArray<Maybe<StopRegistryTariffZone>> | null | undefined,
): Array<StopRegistryVersionLessEntityRefInput> | null => {
  return mapCompactOrNull(refs, (ref) => (ref?.id ? { ref: ref.id } : null));
};

function mapAlternativeNames(
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

function mapQuaysToInput(
  quays: ReadonlyArray<Maybe<StopRegistryQuay>> | null | undefined,
): Array<StopRegistryQuayInput> | null {
  return mapCompactOrNull(quays, (quay) => ({
    ...pick(quay, ['compassBearing', 'keyValues', 'publicCode']),
    name: omitTypeName(quay.name),
    description: omitTypeName(quay.description),
    shortName: omitTypeName(quay.shortName),
    alternativeNames: mapAlternativeNames(quay.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      quay.accessibilityAssessment,
    ),
    boardingPositions: mapBoardingPositionsToInput(quay.boardingPositions),
    geometry: mapGeoJsonToInput(quay.geometry),
    placeEquipments: mapPlaceEquipmentsToInput(quay.placeEquipments),
    privateCode: mapPrivateCodeToInput(quay.privateCode),
  }));
}

function mapOrganizationsToInput(
  organizations:
    | ReadonlyArray<Maybe<StopRegistryStopPlaceOrganisationRef>>
    | null
    | undefined,
): Array<StopRegistryStopPlaceOrganisationRefInput> | null {
  return mapCompactOrNull(organizations, (org) => ({
    organisationRef: org.organisationRef,
    relationshipType: org.relationshipType,
  }));
}

export function mapOriginalToInput(
  originalStop: StopWithDetails,
): StopRegistryStopPlaceInput {
  const stopPlace = originalStop.stop_place;
  if (!stopPlace) {
    throw new Error('Cannot clone a stop without a StopPlace!');
  }

  return {
    ...pick(stopPlace, [
      'keyValues',
      'parentSiteRef',
      'publicCode',
      'stopPlaceType',
      'submode',
      'transportMode',
      'weighting',
    ]),
    name: omitTypeName(stopPlace.name),
    description: omitTypeName(stopPlace.description),
    shortName: omitTypeName(stopPlace.shortName),
    alternativeNames: mapAlternativeNames(stopPlace.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      stopPlace.accessibilityAssessment,
    ),
    geometry: mapGeoJsonToInput(stopPlace.geometry),
    placeEquipments: mapPlaceEquipmentsToInput(stopPlace.placeEquipments),
    privateCode: mapPrivateCodeToInput(stopPlace.privateCode),
    organisations: mapOrganizationsToInput(stopPlace.organisations),
    quays: mapQuaysToInput(stopPlace.quays),
    adjacentSites: mapAdjacentSitesToInput(stopPlace.adjacentSites),
    tariffZones: mapTariffZonesToInput(stopPlace.tariffZones),
    validBetween: null,
    // Location properties:
    // Note: Tiamat sets topographicPlace and fareZone automatically based on coordinates. They can not be changed otherwise.
  };
}

export function mapInfoSpotToInput(
  infoSpot: InfoSpotDetailsFragment,
): StopRegistryInfoSpotInput {
  return {
    ...omitIdAndTypeName(infoSpot),
    infoSpotLocations: null,
    description: omitTypeName(infoSpot.description),
    poster: mapCompactOrNull(infoSpot.poster, omitTypeName),
  };
}
