import {
  StopRegistryGeneralSign,
  StopRegistryGeneralSignInput,
  StopRegistryGeoJson,
  StopRegistryGeoJsonInput,
  StopRegistryGeoJsonType,
  StopRegistryLimitationStatusType,
  StopRegistryPlaceEquipments,
  StopRegistryPlaceEquipmentsInput,
  StopRegistryPrivateCode,
  StopRegistryPrivateCodeInput,
  StopRegistryStopPlace,
  StopRegistryStopPlaceInput,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../hooks';

type AccessibilityAssessmentType =
  StopRegistryStopPlace['accessibilityAssessment'];

export function toStopRegistryGeoJsonInput(
  geoJson: StopRegistryGeoJson | undefined | null,
): StopRegistryGeoJsonInput {
  return {
    coordinates: geoJson?.coordinates ?? null,
    legacyCoordinates: geoJson?.legacyCoordinates ?? null,
    type: geoJson?.type ?? StopRegistryGeoJsonType.GeometryCollection,
  };
}

export function toAccessibilityAssessmentInput(
  originalAccessibilityAssessment: AccessibilityAssessmentType,
) {
  const limitations = originalAccessibilityAssessment?.limitations ?? {};

  return {
    ...originalAccessibilityAssessment,
    limitations: {
      ...limitations,
      audibleSignalsAvailable:
        limitations.audibleSignalsAvailable ??
        StopRegistryLimitationStatusType.Unknown,
      escalatorFreeAccess:
        limitations.escalatorFreeAccess ??
        StopRegistryLimitationStatusType.Unknown,
      liftFreeAccess:
        limitations.liftFreeAccess ?? StopRegistryLimitationStatusType.Unknown,
      stepFreeAccess:
        limitations.stepFreeAccess ?? StopRegistryLimitationStatusType.Unknown,
      wheelchairAccess:
        limitations.wheelchairAccess ??
        StopRegistryLimitationStatusType.Unknown,
    },
  };
}

export function toStopRegistryPrivateCodeInput(
  privateCode: StopRegistryPrivateCode | null,
): StopRegistryPrivateCodeInput {
  return {
    type: privateCode?.type ?? null,
    value: privateCode?.value ?? '',
  };
}

function toStopRegistryGeneralSignInput(
  generalSign: StopRegistryGeneralSign | null,
): StopRegistryGeneralSignInput {
  return {
    content: generalSign?.content ?? null,
    lineSignage: generalSign?.lineSignage ?? null,
    mainLineSign: generalSign?.mainLineSign ?? null,
    note: generalSign?.note ?? null,
    numberOfFrames: generalSign?.numberOfFrames ?? null,
    privateCode: toStopRegistryPrivateCodeInput(
      generalSign?.privateCode ?? null,
    ),
    replacesRailSign: generalSign?.replacesRailSign ?? null,
    signContentType: generalSign?.signContentType ?? null,
  };
}

export function toStopRegistryPlaceEquipmentsInput(
  equipments: StopRegistryPlaceEquipments | null,
): StopRegistryPlaceEquipmentsInput {
  return {
    cycleStorageEquipment:
      equipments?.cycleStorageEquipment?.map(
        (item) => item ?? null, // Ensure each item in the array is InputMaybe
      ) ?? null, // Handle Maybe for the whole array
    generalSign:
      equipments?.generalSign?.map(
        (item) => toStopRegistryGeneralSignInput(item) ?? null,
      ) ?? null,
    sanitaryEquipment:
      equipments?.sanitaryEquipment?.map((item) => item ?? null) ?? null,
    shelterEquipment:
      equipments?.shelterEquipment?.map((item) => item ?? null) ?? null,
    ticketingEquipment:
      equipments?.ticketingEquipment?.map((item) => item ?? null) ?? null,
    waitingRoomEquipment:
      equipments?.waitingRoomEquipment?.map((item) => item ?? null) ?? null,
  };
}

/*
TODO : Copy refs?
const toBoardingPositionsToInput = (
  positions: Maybe<Maybe<StopRegistryBoardingPosition>[]> | undefined,
): StopRegistryBoardingPositionInput[] => {
  return (positions ?? []).map((position) => ({
    geometry: toStopRegistryGeoJsonInput(position?.geometry),
    id: position?.id ?? null,
    publicCode: position?.publicCode ?? null,
  }));
};
const toAdjacentSitesInput = (
  refs: Maybe<Maybe<StopRegistryVersionLessEntityRef>[]> | undefined,
): { ref: string }[] => {
  return (refs ?? []).map((ref) => ({
    ref: ref?.ref ?? '', // Default to an empty string if `ref` is null or undefined
  }));
};
const toTariffZonesInput = (
  refs: Maybe<Maybe<StopRegistryTariffZone>[]> | undefined,
): { ref: string }[] => {
  return (refs ?? []).map((ref) => ({
    ref: ref?.id ?? '', // Default to an empty string if `ref` is null or undefined
  }));
};

const toQuayInput = (
  quays: Maybe<Maybe<StopRegistryQuay>[]> | undefined,
): StopRegistryQuayInput[] => {
  return (quays ?? []).map((quay) => ({
    accessibilityAssessment: toAccessibilityAssessmentInput(
      quay?.accessibilityAssessment,
    ),
    alternativeNames: quay?.alternativeNames?.filter(Boolean) ?? [],
    boardingPositions: toBoardingPositionsToInput(quay?.boardingPositions),
    compassBearing: quay?.compassBearing ?? null,
    description: quay?.description ?? null,
    geometry: toStopRegistryGeoJsonInput(quay?.geometry),
    id: quay?.id ?? null,
    keyValues: quay?.keyValues?.filter(Boolean) ?? [],
    name: quay?.name ?? null,
    placeEquipments: toStopRegistryPlaceEquipmentsInput(
      quay?.placeEquipments ?? null,
    ),
    privateCode: toStopRegistryPrivateCodeInput(quay?.privateCode ?? null),
    publicCode: quay?.publicCode ?? null,
    shortName: quay?.shortName ?? null,
  }));
};

const mapValidBetweenToInput = (
  validBetween: StopRegistryValidBetween | null | undefined,
): StopRegistryValidBetweenInput | null => {
  if (!validBetween || !validBetween.fromDate) {
    return null;
  }

  return {
    fromDate: validBetween.fromDate, // Map the required `fromDate`
    toDate: validBetween.toDate ?? null, // Default `toDate` to null if not provided
  };
};
*/

export function mapOriginalToInput(
  originalStop: StopWithDetails,
): StopRegistryStopPlaceInput {
  return {
    ...originalStop,
    accessibilityAssessment: toAccessibilityAssessmentInput(
      originalStop?.stop_place?.accessibilityAssessment,
    ),
    geometry: toStopRegistryGeoJsonInput(originalStop?.stop_place?.geometry),
    placeEquipments: toStopRegistryPlaceEquipmentsInput(
      originalStop?.stop_place?.placeEquipments ?? null,
    ),
    privateCode: toStopRegistryPrivateCodeInput(
      originalStop?.stop_place?.privateCode ?? null,
    ),
    /*  TODO : Copy refs?
        quays: toQuayInput(originalStop.stop_place?.quays),
        adjacentSites: toAdjacentSitesInput(originalStop.stop_place?.adjacentSites),
        tariffZones: toTariffZonesInput(originalStop.stop_place?.tariffZones),
        validBetween: mapValidBetweenToInput(originalStop.stop_place?.validBetween),
        */
  };
}
