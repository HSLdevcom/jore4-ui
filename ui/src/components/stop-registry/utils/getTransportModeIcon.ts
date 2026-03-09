import { StopRegistryTransportModeType } from '../../../generated/graphql';

export function getTransportModeIcon(
  mode: StopRegistryTransportModeType | null | undefined,
) {
  switch (mode) {
    case StopRegistryTransportModeType.Tram:
      return 'icon-tram-filled text-hsl-tram-dark-green';
    default:
      return 'icon-bus-alt text-tweaked-brand';
  }
}
