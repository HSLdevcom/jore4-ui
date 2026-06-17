import { TFunction } from 'i18next';
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

function getTransportModeTypeText(
  t: TFunction,
  mode: StopRegistryTransportModeType | null | undefined,
  trunkLine: boolean,
  speedTram: boolean,
) {
  switch (mode) {
    case StopRegistryTransportModeType.Tram:
      return speedTram
        ? t(($) => $.accessibility.stops.transportMode.type_speedTram)
        : t(($) => $.accessibility.stops.transportMode.type_tram);

    case StopRegistryTransportModeType.Metro:
      return t(($) => $.accessibility.stops.transportMode.type_metro);

    case StopRegistryTransportModeType.Water:
      return t(($) => $.accessibility.stops.transportMode.type_water);

    case StopRegistryTransportModeType.Rail:
      return t(($) => $.accessibility.stops.transportMode.type_rail);

    case StopRegistryTransportModeType.Bus:
    default:
      return trunkLine
        ? t(($) => $.accessibility.stops.transportMode.type_trunkLine)
        : t(($) => $.accessibility.stops.transportMode.type_bus);
  }
}

export function getTransportModeIconTitle(
  t: TFunction,
  mode: StopRegistryTransportModeType | null | undefined,
  active: boolean = true,
  trunkLine: boolean = false,
  speedTram: boolean = false,
) {
  const stopType = getTransportModeTypeText(t, mode, trunkLine, speedTram);
  const stopTypeState = active
    ? t(($) => $.accessibility.stops.transportMode.status_inUse)
    : t(($) => $.accessibility.stops.transportMode.status_outOfUse);

  return t(($) => $.accessibility.stops.transportMode.stopIconTitle, {
    stopType,
    stopTypeState,
  });
}
