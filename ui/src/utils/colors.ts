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
    return theme.colors.tweakedBrand; // Default blue color
  }

  const { colors } = theme;
  const defaultColor = colors.tweakedBrand;

  const transportModeColors: Record<StopRegistryTransportModeType, string> = {
    [StopRegistryTransportModeType.Air]: defaultColor,
    [StopRegistryTransportModeType.Bus]: colors.routes.bus,
    [StopRegistryTransportModeType.Cableway]: defaultColor,
    [StopRegistryTransportModeType.Funicular]: defaultColor,
    [StopRegistryTransportModeType.Metro]: colors.routes.metro,
    [StopRegistryTransportModeType.Rail]: colors.routes.train,
    [StopRegistryTransportModeType.Tram]: colors.routes.tram,
    [StopRegistryTransportModeType.Water]: colors.routes.ferry,
  };
  return transportModeColors[transportMode] ?? defaultColor;
};
