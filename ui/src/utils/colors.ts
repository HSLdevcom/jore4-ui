import {
  ReusableComponentsVehicleModeEnum,
  StopRegistryTransportModeType,
} from '../generated/graphql';
import { theme } from '../generated/theme';

export const mapVehicleModeToRouteColor = (
  key: ReusableComponentsVehicleModeEnum,
) => {
  const { colors } = theme;

  const routeColors: Record<ReusableComponentsVehicleModeEnum, string> = {
    [ReusableComponentsVehicleModeEnum.Bus]: colors.routes.bus,
    [ReusableComponentsVehicleModeEnum.Ferry]: colors.routes.ferry,
    [ReusableComponentsVehicleModeEnum.Metro]: colors.routes.metro,
    [ReusableComponentsVehicleModeEnum.Train]: colors.routes.train,
    [ReusableComponentsVehicleModeEnum.Tram]: colors.routes.tram,
  };
  return routeColors[key];
};

export const mapTransportModeToColor = (
  transportMode?: StopRegistryTransportModeType | null,
): string => {
  if (!transportMode) {
    return '#0074BF'; // Default blue color
  }

  const { colors } = theme;

  const transportModeColors: Record<StopRegistryTransportModeType, string> = {
    [StopRegistryTransportModeType.Air]: '#0074BF',
    [StopRegistryTransportModeType.Bus]: colors.routes.bus,
    [StopRegistryTransportModeType.Cableway]: '#0074BF',
    [StopRegistryTransportModeType.Funicular]: '#0074BF',
    [StopRegistryTransportModeType.Metro]: colors.routes.metro,
    [StopRegistryTransportModeType.Rail]: colors.routes.train,
    [StopRegistryTransportModeType.Tram]: colors.routes.tram,
    [StopRegistryTransportModeType.Water]: colors.routes.ferry,
  };

  return transportModeColors[transportMode] ?? '#0074BF';
};
