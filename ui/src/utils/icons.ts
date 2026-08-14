import { twJoin } from 'tailwind-merge';
import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
  StopRegistryTransportModeType,
} from '../generated/graphql';

function getTramColor(active: boolean, speedTram: boolean) {
  if (active && speedTram) {
    return 'text-hsl-speed-tram-turquoise';
  }

  if (active) {
    return 'text-hsl-tram-dark-green';
  }

  return 'text-light-grey';
}

function getBusColor(active: boolean, trunkLine: boolean) {
  if (active && trunkLine) {
    return 'text-hsl-trunk-line-orange';
  }

  if (active) {
    return 'text-tweaked-brand';
  }

  return 'text-light-grey';
}

export function getTransportModeIcon(
  mode: StopRegistryTransportModeType | null | undefined,
  active?: boolean,
  trunkLine?: boolean,
  speedTram?: boolean,
): string;
export function getTransportModeIcon(
  mode: ReusableComponentsVehicleModeEnum | null | undefined,
  lineType: RouteTypeOfLineEnum | null | undefined,
): string;
export function getTransportModeIcon(
  mode:
    | StopRegistryTransportModeType
    | ReusableComponentsVehicleModeEnum
    | null
    | undefined,
  activeIn: boolean | RouteTypeOfLineEnum | null | undefined = true,
  trunkLineIn: boolean = false,
  speedTramIn: boolean = false,
): string {
  const active = activeIn !== false;
  const trunkLine =
    trunkLineIn || activeIn === RouteTypeOfLineEnum.ExpressBusService;
  const speedTram =
    speedTramIn || activeIn === RouteTypeOfLineEnum.RegionalTramService;

  switch (mode) {
    case ReusableComponentsVehicleModeEnum.Tram:
    case StopRegistryTransportModeType.Tram:
      return twJoin('icon-tram-filled', getTramColor(active, speedTram));

    case ReusableComponentsVehicleModeEnum.Metro:
    case StopRegistryTransportModeType.Metro:
      return twJoin(
        'icon-metro-filled',
        active ? 'text-hsl-metro-orange' : 'text-light-grey',
      );

    case ReusableComponentsVehicleModeEnum.Ferry:
    case StopRegistryTransportModeType.Water:
      return twJoin(
        'icon-ferry-filled',
        active ? 'text-hsl-ferry-blue' : 'text-light-grey',
      );

    case ReusableComponentsVehicleModeEnum.Train:
    case StopRegistryTransportModeType.Rail:
      return twJoin(
        'icon-train-filled',
        active ? 'text-hsl-train-purple' : 'text-light-grey',
      );

    case ReusableComponentsVehicleModeEnum.Bus:
    case StopRegistryTransportModeType.Bus:
    default:
      return twJoin('icon-bus-alt', getBusColor(active, trunkLine));
  }
}
