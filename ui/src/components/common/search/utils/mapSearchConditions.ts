import { ReusableComponentsVehicleModeEnum } from '../../../../generated/graphql';
import { JoreStopRegistryTransportModeType } from '../../../../types/stop-registry';
import { AllOptionEnum, SearchConditions } from '../../../../utils';
import { RoutesAndLinesSearchFilters } from '../../../routes-and-lines/search/types';

function mapVehicleModeToJoreTransportMode(
  mode?: ReadonlyArray<ReusableComponentsVehicleModeEnum | AllOptionEnum>,
): Array<JoreStopRegistryTransportModeType | AllOptionEnum> {
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

  if (!mode) {
    return [AllOptionEnum.All];
  }

  return mode.map((m) => {
    if (m === AllOptionEnum.All) {
      return AllOptionEnum.All;
    }

    return mapping[m];
  });
}

function mapJoreTransportModeToVehicleMode(
  mode: ReadonlyArray<JoreStopRegistryTransportModeType | AllOptionEnum>,
): Array<ReusableComponentsVehicleModeEnum | AllOptionEnum> {
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
}

export function mapFiltersToSearchConditions(
  input: Readonly<RoutesAndLinesSearchFilters>,
): Readonly<SearchConditions> {
  return {
    ...input,
    transportMode: mapJoreTransportModeToVehicleMode(input.transportMode),
  };
}

export function mapSearchConditionsToFilters(
  input: Readonly<SearchConditions>,
): Readonly<RoutesAndLinesSearchFilters> {
  return {
    ...input,
    priorities: [...input.priorities],
    transportMode: mapVehicleModeToJoreTransportMode(input.transportMode),
    typeOfLine: input.typeOfLine ?? AllOptionEnum.All,
  };
}
