import {
  ReusableComponentsVehicleModeEnum,
  StopRegistryTransportModeType,
} from '../../generated/graphql';

const vehicleModeValues = Object.values(ReusableComponentsVehicleModeEnum);

export const parseVehicleMode = (
  transportMode?: string | null,
): ReusableComponentsVehicleModeEnum | null => {
  if (!transportMode) {
    return null;
  }

  const normalized = transportMode.toLowerCase();
  if (
    vehicleModeValues.includes(normalized as ReusableComponentsVehicleModeEnum)
  ) {
    return normalized as ReusableComponentsVehicleModeEnum;
  }

  return null;
};

const stopRegistryTransportModeValues = Object.values(
  StopRegistryTransportModeType,
);

export const parseStopRegistryTransportMode = (
  transportMode?: string | StopRegistryTransportModeType | null,
): StopRegistryTransportModeType | null => {
  if (!transportMode) {
    return null;
  }

  const normalizedTransportMode = transportMode.toLowerCase();
  if (
    stopRegistryTransportModeValues.includes(
      normalizedTransportMode as StopRegistryTransportModeType,
    )
  ) {
    return normalizedTransportMode as StopRegistryTransportModeType;
  }

  return null;
};
