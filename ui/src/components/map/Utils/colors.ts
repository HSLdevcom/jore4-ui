import { StopRegistryTransportModeType } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';

const { colors } = theme;

const transportModeColors: Record<StopRegistryTransportModeType, string> = {
  [StopRegistryTransportModeType.Air]: colors.tweakedBrand,
  [StopRegistryTransportModeType.Bus]: colors.routes.bus,
  [StopRegistryTransportModeType.Cableway]: colors.tweakedBrand,
  [StopRegistryTransportModeType.Funicular]: colors.tweakedBrand,
  [StopRegistryTransportModeType.Metro]: colors.routes.metro,
  [StopRegistryTransportModeType.Rail]: colors.routes.train,
  [StopRegistryTransportModeType.Tram]: colors.routes.tram,
  [StopRegistryTransportModeType.Water]: colors.routes.ferry,
};

export function mapTransportModeToColor(
  transportMode?: StopRegistryTransportModeType | null,
): string {
  if (transportMode && transportMode in transportModeColors) {
    return transportModeColors[transportMode];
  }

  return theme.colors.tweakedBrand; // Default blue color
}
