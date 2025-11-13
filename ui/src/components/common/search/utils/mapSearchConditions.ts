import { ReusableComponentsVehicleModeEnum } from '../../../../generated/graphql';
import { JoreStopRegistryTransportModeType } from '../../../../types/stop-registry';
import { AllOptionEnum } from '../../../../utils';
import { RoutesAndLinesSearchFilters } from '../../../routes-and-lines/search/types';
import { SearchConditions } from '../useSearchQueryParser';

const mapVehicleModeToJoreTransportMode = (
  mode: (ReusableComponentsVehicleModeEnum | AllOptionEnum)[],
): (JoreStopRegistryTransportModeType | AllOptionEnum)[] => {
  const mapping: Record<
    ReusableComponentsVehicleModeEnum,
    JoreStopRegistryTransportModeType
  > = {
    [ReusableComponentsVehicleModeEnum.Bus]:
      JoreStopRegistryTransportModeType.Bus,
    [ReusableComponentsVehicleModeEnum.Tram]:
      JoreStopRegistryTransportModeType.Tram,
    [ReusableComponentsVehicleModeEnum.Metro]:
      JoreStopRegistryTransportModeType.Metro,
    [ReusableComponentsVehicleModeEnum.Train]:
      JoreStopRegistryTransportModeType.Rail,
    [ReusableComponentsVehicleModeEnum.Ferry]:
      JoreStopRegistryTransportModeType.Water,
  };

  return mode.map((m) => {
    if (m === AllOptionEnum.All) {
      return AllOptionEnum.All;
    }

    return mapping[m];
  });
};

const mapJoreTransportModeToVehicleMode = (
  mode: (JoreStopRegistryTransportModeType | AllOptionEnum)[],
): (ReusableComponentsVehicleModeEnum | AllOptionEnum)[] => {
  const mapping: Record<
    JoreStopRegistryTransportModeType,
    ReusableComponentsVehicleModeEnum
  > = {
    [JoreStopRegistryTransportModeType.Bus]:
      ReusableComponentsVehicleModeEnum.Bus,
    [JoreStopRegistryTransportModeType.Tram]:
      ReusableComponentsVehicleModeEnum.Tram,
    [JoreStopRegistryTransportModeType.Metro]:
      ReusableComponentsVehicleModeEnum.Metro,
    [JoreStopRegistryTransportModeType.Rail]:
      ReusableComponentsVehicleModeEnum.Train,
    [JoreStopRegistryTransportModeType.Water]:
      ReusableComponentsVehicleModeEnum.Ferry,
  };

  return mode.map((m) => {
    if (m === AllOptionEnum.All) {
      return AllOptionEnum.All;
    }

    return mapping[m];
  });
};

export const mapFiltersToSearchConditions = (
  input: RoutesAndLinesSearchFilters,
): SearchConditions => {
  return {
    ...input,
    transportMode: mapJoreTransportModeToVehicleMode(input.transportMode),
  };
};

export const mapSearchConditionsToFilters = (
  input: SearchConditions,
): RoutesAndLinesSearchFilters => {
  return {
    ...input,
    transportMode: mapVehicleModeToJoreTransportMode(input.transportMode),
  };
};
