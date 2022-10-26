import { ReusableComponentsVehicleModeEnum } from '../generated/graphql';
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
