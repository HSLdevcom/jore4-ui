import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
  StopRegistryTransportModeType,
} from '../generated/graphql';
import { theme } from '../generated/theme';

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

const routeColors: Record<ReusableComponentsVehicleModeEnum, string> = {
  [ReusableComponentsVehicleModeEnum.Bus]: colors.routes.bus,
  [ReusableComponentsVehicleModeEnum.Ferry]: colors.routes.ferry,
  [ReusableComponentsVehicleModeEnum.Metro]: colors.routes.metro,
  [ReusableComponentsVehicleModeEnum.Train]: colors.routes.train,
  [ReusableComponentsVehicleModeEnum.Tram]: colors.routes.tram,
};

const routeColorClasses: Record<ReusableComponentsVehicleModeEnum, string> = {
  [ReusableComponentsVehicleModeEnum.Bus]: 'bg-tweaked-brand',
  [ReusableComponentsVehicleModeEnum.Ferry]: 'bg-hsl-ferry-blue',
  [ReusableComponentsVehicleModeEnum.Metro]: 'bg-hsl-metro-orange',
  [ReusableComponentsVehicleModeEnum.Train]: 'bg-hsl-train-purple',
  [ReusableComponentsVehicleModeEnum.Tram]: 'bg-hsl-tram-green',
};

export function mapTransportModeToColor(
  transportMode?: StopRegistryTransportModeType | null,
): string {
  if (transportMode && transportMode in transportModeColors) {
    return transportModeColors[transportMode];
  }

  return theme.colors.tweakedBrand;
}

export function mapVehicleModeToRouteColor(
  key: ReusableComponentsVehicleModeEnum,
  typeOfLine?: RouteTypeOfLineEnum,
): string {
  if (typeOfLine === RouteTypeOfLineEnum.ExpressBusService) {
    return colors.hslTrunkLineOrange;
  }

  if (typeOfLine === RouteTypeOfLineEnum.RegionalTramService) {
    return colors.hslSpeedTramTurquoise;
  }

  return routeColors[key];
}

export function mapVehicleModeToRouteColorClass(
  key: ReusableComponentsVehicleModeEnum,
  typeOfLine?: RouteTypeOfLineEnum,
): string {
  if (typeOfLine === RouteTypeOfLineEnum.ExpressBusService) {
    return 'bg-hsl-trunk-line-orange';
  }

  if (typeOfLine === RouteTypeOfLineEnum.RegionalTramService) {
    return 'bg-hsl-speed-tram-turquoise';
  }

  return routeColorClasses[key];
}
