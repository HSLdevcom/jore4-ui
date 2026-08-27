import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../../generated/graphql';
import { theme } from '../../../../generated/theme';

const { colors } = theme;

const routeColors: Record<ReusableComponentsVehicleModeEnum, string> = {
  [ReusableComponentsVehicleModeEnum.Bus]: colors.routes.bus,
  [ReusableComponentsVehicleModeEnum.Ferry]: colors.routes.ferry,
  [ReusableComponentsVehicleModeEnum.Metro]: colors.routes.metro,
  [ReusableComponentsVehicleModeEnum.Train]: colors.routes.train,
  [ReusableComponentsVehicleModeEnum.Tram]: colors.routes.tram,
};

export function mapVehicleModeToRouteColor(
  key: ReusableComponentsVehicleModeEnum,
  typeOfLine?: RouteTypeOfLineEnum,
) {
  if (typeOfLine === RouteTypeOfLineEnum.ExpressBusService) {
    return colors.hslTrunkLineOrange;
  }

  if (typeOfLine === RouteTypeOfLineEnum.RegionalTramService) {
    return colors.hslSpeedTramTurquoise;
  }

  return routeColors[key];
}
