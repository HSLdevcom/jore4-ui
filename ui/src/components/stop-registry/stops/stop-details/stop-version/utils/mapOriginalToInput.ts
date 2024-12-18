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
  StopRegistryBoardingPosition,
  StopRegistryBoardingPositionInput,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryEmbeddableMultilingualStringInput,
  StopRegistryGeneralSign,
  StopRegistryGeneralSignInput,
  StopRegistryGeoJson,
  StopRegistryGeoJsonInput,
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
  StopRegistryTopographicPlace,
  StopRegistryTopographicPlaceInput,
  StopRegistryVersionLessEntityRef,
  StopRegistryVersionLessEntityRefInput,
} from '../../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../../hooks';

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
function mapCompactOrNull<T extends object, R>(
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

function toStopRegistryGeoJsonInput(
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
    ...omit(generalSign, ['id', 'privateCode', '__typename']),
    privateCode: mapPrivateCodeToInput(generalSign?.privateCode),
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
    geometry: toStopRegistryGeoJsonInput(position.geometry),
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

function mapName(
  name: StopRegistryEmbeddableMultilingualString | null | undefined,
): InputMaybe<StopRegistryEmbeddableMultilingualStringInput> {
  if (!name) {
    return null;
  }

  return omitTypeName(name);
}

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
    ...pick(quay, ['compassBearing', 'keyValues', 'name', 'publicCode']),
    name: mapName(quay.name),
    description: mapName(quay.description),
    shortName: mapName(quay.shortName),
    alternativeNames: mapAlternativeNames(quay.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      quay.accessibilityAssessment,
    ),
    boardingPositions: mapBoardingPositionsToInput(quay.boardingPositions),
    geometry: toStopRegistryGeoJsonInput(quay.geometry),
    placeEquipments: mapPlaceEquipmentsToInput(quay.placeEquipments),
    privateCode: mapPrivateCodeToInput(quay.privateCode),
  }));
}

function mapTopographicPlaceToInput(
  topographicPlace: StopRegistryTopographicPlace | null | undefined,
): InputMaybe<StopRegistryTopographicPlaceInput> {
  if (!topographicPlace?.id) {
    return null;
  }

  return { id: topographicPlace.id };
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
    name: mapName(stopPlace.name),
    description: mapName(stopPlace.description),
    shortName: mapName(stopPlace.shortName),
    alternativeNames: mapAlternativeNames(stopPlace.alternativeNames),
    accessibilityAssessment: mapAccessibilityAssessmentToInput(
      stopPlace.accessibilityAssessment,
    ),
    geometry: toStopRegistryGeoJsonInput(stopPlace.geometry),
    placeEquipments: mapPlaceEquipmentsToInput(stopPlace.placeEquipments),
    privateCode: mapPrivateCodeToInput(stopPlace.privateCode),
    organisations: mapOrganizationsToInput(stopPlace.organisations),
    topographicPlace: mapTopographicPlaceToInput(stopPlace.topographicPlace),
    quays: mapQuaysToInput(stopPlace.quays),
    adjacentSites: mapAdjacentSitesToInput(stopPlace.adjacentSites),
    tariffZones: mapTariffZonesToInput(stopPlace.tariffZones),
    validBetween: null,
  };
}
