import { ReusableComponentsVehicleModeEnum } from '../generated/graphql';

export const vehicleModeIconMapping: Readonly<
  Record<ReusableComponentsVehicleModeEnum, string>
> = {
  [ReusableComponentsVehicleModeEnum.Bus]: 'icon-bus-alt text-tweaked-brand',
  [ReusableComponentsVehicleModeEnum.Tram]:
    'icon-tram-filled text-hsl-tram-dark-green',
  [ReusableComponentsVehicleModeEnum.Metro]:
    'icon-metro-filled text-hsl-metro-orange',
  [ReusableComponentsVehicleModeEnum.Train]:
    'icon-train-filled text-hsl-train-purple',
  [ReusableComponentsVehicleModeEnum.Ferry]:
    'icon-ferry-filled text-hsl-ferry-blue',
};
