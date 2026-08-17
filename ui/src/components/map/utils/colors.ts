import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
  StopRegistryTransportModeType,
} from '../../../generated/graphql';
import { theme } from '../../../generated/theme';

const { colors } = theme;

const routeColors: Record<ReusableComponentsVehicleModeEnum, string> = {
  [ReusableComponentsVehicleModeEnum.Bus]: colors.routes.bus,
  [ReusableComponentsVehicleModeEnum.Ferry]: colors.routes.ferry,
  [ReusableComponentsVehicleModeEnum.Metro]: colors.routes.metro,
  [ReusableComponentsVehicleModeEnum.Train]: colors.routes.train,
  [ReusableComponentsVehicleModeEnum.Tram]: colors.routes.tram,
};

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

export const mapVehicleModeToRouteColor = (
  key: ReusableComponentsVehicleModeEnum,
  typeOfLine?: RouteTypeOfLineEnum,
) => {
  if (typeOfLine === RouteTypeOfLineEnum.ExpressBusService) {
    return colors.hslTrunkLineOrange;
  }

  if (typeOfLine === RouteTypeOfLineEnum.RegionalTramService) {
    return colors.hslSpeedTramTurquoise;
  }

  return routeColors[key];
};

export const mapTransportModeToColor = (
  transportMode?: StopRegistryTransportModeType | null,
): string => {
  if (transportMode && transportMode in transportModeColors) {
    return transportModeColors[transportMode];
  }

  return theme.colors.tweakedBrand; // Default blue color
};
