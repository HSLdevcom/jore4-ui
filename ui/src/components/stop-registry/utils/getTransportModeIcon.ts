import { twJoin } from 'tailwind-merge';
import { StopRegistryTransportModeType } from '../../../generated/graphql';

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
  active: boolean = true,
  trunkLine: boolean = false,
  speedTram: boolean = false,
) {
  switch (mode) {
    case StopRegistryTransportModeType.Tram:
      return twJoin('icon-tram-filled', getTramColor(active, speedTram));

    case StopRegistryTransportModeType.Metro:
      return twJoin(
        'icon-metro-filled',
        active ? 'text-hsl-metro-orange' : 'text-light-grey',
      );

    case StopRegistryTransportModeType.Water:
      return twJoin(
        'icon-ferry-filled',
        active ? 'text-hsl-ferry-blue' : 'text-light-grey',
      );

    case StopRegistryTransportModeType.Rail:
      return twJoin(
        'icon-train-filled',
        active ? 'text-hsl-train-purple' : 'text-light-grey',
      );

    case StopRegistryTransportModeType.Bus:
    default:
      return twJoin('icon-bus-alt', getBusColor(active, trunkLine));
  }
}
