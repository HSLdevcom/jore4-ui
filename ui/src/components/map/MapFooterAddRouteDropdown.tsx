import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import {
  SimpleButtonDropdownMenu,
  SimpleDropdownMenuItem,
} from '../common/Dropdowns';

const testIds: Readonly<Record<string, string>> = {
  addBusRoute: 'AddRouteDropdownOption::addBusRoute',
  addTramRoute: 'AddRouteDropdownOption::addTramRoute',
};

type MapFooterAddRouteDropdownProps = {
  readonly onAddRoute: (vehicleMode: ReusableComponentsVehicleModeEnum) => void;
  readonly testId: string;
  readonly disabled?: boolean;
  readonly inverted?: boolean;
};

export const MapFooterAddRouteDropdown: FC<MapFooterAddRouteDropdownProps> = ({
  onAddRoute,
  testId,
  disabled,
  inverted,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleButtonDropdownMenu
      buttonText={t(($) => $.map.addRoute)}
      disabled={disabled}
      inverted={inverted}
      testId={testId}
    >
      <SimpleDropdownMenuItem
        testId={testIds.addBusRoute}
        data-vehicle-mode={ReusableComponentsVehicleModeEnum.Bus}
        onClick={() => onAddRoute(ReusableComponentsVehicleModeEnum.Bus)}
      >
        {t(($) => $.map.addBusRoute)}
      </SimpleDropdownMenuItem>
      <SimpleDropdownMenuItem
        testId={testIds.addTramRoute}
        data-vehicle-mode={ReusableComponentsVehicleModeEnum.Tram}
        onClick={() => onAddRoute(ReusableComponentsVehicleModeEnum.Tram)}
      >
        {t(($) => $.map.addTramRoute)}
      </SimpleDropdownMenuItem>
    </SimpleButtonDropdownMenu>
  );
};
