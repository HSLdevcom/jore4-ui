import { ReusableComponentsVehicleModeEnum } from '../generated/graphql';
import { theme } from '../generated/theme';
import { TimetablePriority } from '../types/enums';

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

export const getTimetableHeadingBgColor = (key: TimetablePriority) => {
  const bgColors: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: 'bg-hsl-dark-green',
    [TimetablePriority.Temporary]: 'bg-city-bicycle-yellow',
    [TimetablePriority.Special]: 'bg-hsl-light-purple',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-red',
  };
  return bgColors[key];
};
