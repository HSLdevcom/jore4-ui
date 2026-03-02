import { StopRegistryTransportModeType } from '../../generated/graphql';

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
