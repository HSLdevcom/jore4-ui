import {
  ReusableComponentsVehicleModeEnum,
  StopRegistryTransportModeType,
} from '../../generated/graphql';

const vehicleModeValues = Object.values(ReusableComponentsVehicleModeEnum);

export function parseVehicleMode(
  transportMode?: string | null,
): ReusableComponentsVehicleModeEnum | null {
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
}

const stopRegistryTransportModeValues = Object.values(
  StopRegistryTransportModeType,
);

export function parseStopRegistryTransportMode(
  transportMode: unknown,
  strict: true,
): StopRegistryTransportModeType;
export function parseStopRegistryTransportMode(
  transportMode: unknown,
  strict?: boolean,
): StopRegistryTransportModeType | null;
export function parseStopRegistryTransportMode(
  transportMode: unknown,
  strict?: boolean,
): StopRegistryTransportModeType | null {
  if (!transportMode) {
    return null;
  }

  if (typeof transportMode !== 'string') {
    throw new TypeError(
      `Expected transportMode to be a string! But was: typeof(${typeof transportMode})`,
    );
  }

  const normalized = transportMode.toLowerCase();
  if (
    stopRegistryTransportModeValues.includes(
      normalized as StopRegistryTransportModeType,
    )
  ) {
    return normalized as StopRegistryTransportModeType;
  }

  if (strict) {
    throw new TypeError(
      `Expected transportMode to be a valid StopRegistryTransportModeType. transportMode(${transportMode}); normalized(${normalized}); StopRegistryTransportModeType(${stopRegistryTransportModeValues})`,
    );
  }

  return null;
}

export function parseStopRegistryTransportModeJsonArray(
  transportModes: unknown,
): Array<StopRegistryTransportModeType> {
  if (!Array.isArray(transportModes)) {
    throw new TypeError(
      `Expected transportModes to be an array! But was: typeof(${typeof transportModes})`,
    );
  }

  return transportModes
    .map((it) => parseStopRegistryTransportMode(it, true))
    .sort();
}

const vehicleToTransportModeMap = {
  [ReusableComponentsVehicleModeEnum.Bus]: StopRegistryTransportModeType.Bus,
  [ReusableComponentsVehicleModeEnum.Ferry]:
    StopRegistryTransportModeType.Water,
  [ReusableComponentsVehicleModeEnum.Metro]:
    StopRegistryTransportModeType.Metro,
  [ReusableComponentsVehicleModeEnum.Train]: StopRegistryTransportModeType.Rail,
  [ReusableComponentsVehicleModeEnum.Tram]: StopRegistryTransportModeType.Tram,
} as const satisfies Readonly<
  Record<ReusableComponentsVehicleModeEnum, StopRegistryTransportModeType>
>;

export function mapVehicleModeToTransportMode(
  vehicleMode: ReusableComponentsVehicleModeEnum,
): StopRegistryTransportModeType {
  return vehicleToTransportModeMap[vehicleMode];
}
