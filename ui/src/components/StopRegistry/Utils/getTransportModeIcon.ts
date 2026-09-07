import { TFunction } from 'i18next';
import { StopRegistryTransportModeType } from '../../../generated/graphql';

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
