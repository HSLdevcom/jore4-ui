import {
  StopPlaceDetailsFragment,
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
import { StopPlaceKeyValues } from './createStopVersionCommon';

type KeyValues = {
  key: keyof StopPlaceKeyValues | string;
  values: Array<string | null>;
};
type PersistedStopPlaceKeyValues = StopPlaceDetailsFragment['keyValues'];
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

export function updateKeyValues(
  newKeyValues: KeyValues[],
  oldKeyValues: PersistedStopPlaceKeyValues,
): KeyValues[] {
  const keyValueMap = new Map<string, Array<string | null>>();

  oldKeyValues?.forEach((item) => {
    if (item && item.key && item.values) {
      keyValueMap.set(item.key, item.values);
    }
  });
  newKeyValues.forEach((newItem) => {
    keyValueMap.set(newItem.key, newItem.values);
  });

  return Array.from(keyValueMap, ([key, values]) => ({ key, values }));
}

export function mapOriginalToInput(
  originalStop: StopWithDetails,
): StopRegistryStopPlaceInput {
  return {
    ...originalStop,
    accessibilityAssessment: toAccessibilityAssessmentInput(
      originalStop.stop_place?.accessibilityAssessment,
    ),
    geometry: toStopRegistryGeoJsonInput(originalStop.stop_place?.geometry),
    placeEquipments: toStopRegistryPlaceEquipmentsInput(
      originalStop.stop_place?.placeEquipments ?? null,
    ),
    privateCode: toStopRegistryPrivateCodeInput(
      originalStop.stop_place?.privateCode ?? null,
    ),
  };
}
