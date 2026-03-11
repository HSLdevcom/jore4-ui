import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { SimpleDropdownMenuItem } from '../../uiComponents';
import { SimpleButtonDropdownMenu } from '../../uiComponents/SimpleButtonDropdownMenu';

const testIds = {
  addBusStop: 'AddStopDropdownOption::addBusStop',
  addTramStop: 'AddStopDropdownOption::addTramStop',
};

type MapFooterAddStopDropdownProps = {
  onAddStops: (vehicleMode: ReusableComponentsVehicleModeEnum) => void;
  testId: string;
  disabled?: boolean;
  inverted?: boolean;
};

export const MapFooterAddStopDropdown: FC<MapFooterAddStopDropdownProps> = ({
  onAddStops,
  testId,
  disabled,
  inverted,
}) => {
  const { t } = useTranslation();
  return (
    <SimpleButtonDropdownMenu
      buttonText={t('map.addStop')}
      disabled={disabled}
      inverted={inverted}
      testId={testId}
      disabledTooltip={t('dataModelRefactor.disabled')}
    >
      <SimpleDropdownMenuItem
        testId={testIds.addBusStop}
        dataVehicleMode={ReusableComponentsVehicleModeEnum.Bus}
        onClick={() => onAddStops(ReusableComponentsVehicleModeEnum.Bus)}
      >
        {t('map.addBusStop')}
      </SimpleDropdownMenuItem>
      <SimpleDropdownMenuItem
        testId={testIds.addTramStop}
        dataVehicleMode={ReusableComponentsVehicleModeEnum.Tram}
        onClick={() => onAddStops(ReusableComponentsVehicleModeEnum.Tram)}
      >
        {t('map.addTramStop')}
      </SimpleDropdownMenuItem>
    </SimpleButtonDropdownMenu>
  );
};
