import without from 'lodash/without';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import { mapLineTypeToUiName } from '../../../i18n/uiNameMappings';
import { AllOptionEnum } from '../../../utils';
import { FormInputProps } from '../../common';
import { EnumDropdown } from '../common';

type LineTypesByVehicleMode = Record<
  ReusableComponentsVehicleModeEnum,
  ReadonlyArray<RouteTypeOfLineEnum>
>;

export const lineTypesByVehicleMode: Readonly<LineTypesByVehicleMode> = {
  [ReusableComponentsVehicleModeEnum.Bus]: [
    RouteTypeOfLineEnum.ExpressBusService,
    RouteTypeOfLineEnum.DemandAndResponseBusService,
    RouteTypeOfLineEnum.RegionalBusService,
    RouteTypeOfLineEnum.StoppingBusService,
  ],

  [ReusableComponentsVehicleModeEnum.Ferry]: [RouteTypeOfLineEnum.FerryService],

  [ReusableComponentsVehicleModeEnum.Train]: [
    RouteTypeOfLineEnum.RegionalRailService,
    RouteTypeOfLineEnum.SuburbanRailway,
  ],

  [ReusableComponentsVehicleModeEnum.Tram]: [
    RouteTypeOfLineEnum.CityTramService,
    RouteTypeOfLineEnum.RegionalTramService,
  ],

  [ReusableComponentsVehicleModeEnum.Metro]: [RouteTypeOfLineEnum.MetroService],
};

const allRouteTypes: ReadonlyArray<RouteTypeOfLineEnum> =
  Object.values(RouteTypeOfLineEnum);
const disabledRouteTypesByVehicleMode: Readonly<LineTypesByVehicleMode> =
  Object.values(ReusableComponentsVehicleModeEnum).reduce(
    (disabled, vehicleMode) => ({
      ...disabled,
      [vehicleMode]: without(
        allRouteTypes,
        ...lineTypesByVehicleMode[vehicleMode],
      ),
    }),
    {} as Record<
      ReusableComponentsVehicleModeEnum,
      ReadonlyArray<RouteTypeOfLineEnum>
    >,
  );

type LineTypeDropdownProps = FormInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly includeAllOption?: boolean;
  readonly vehicleMode?: ReusableComponentsVehicleModeEnum;
};

export const LineTypeDropdown: FC<LineTypeDropdownProps> = ({
  id,
  testId,
  includeAllOption,
  vehicleMode,
  ...formInputProps
}) => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<RouteTypeOfLineEnum | AllOptionEnum.All>
      id={id}
      testId={testId}
      enumType={RouteTypeOfLineEnum}
      placeholder={t(($) => $.lines.chooseTypeOfLine)}
      uiNameMapper={(value) => mapLineTypeToUiName(t, value)}
      includeAllOption={!!includeAllOption}
      disabledOptions={
        vehicleMode && disabledRouteTypesByVehicleMode[vehicleMode]
      }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
