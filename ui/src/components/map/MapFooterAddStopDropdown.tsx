import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { SimpleDropdownMenuItem } from '../../uiComponents';
import { SimpleButtonDropdownMenu } from '../../uiComponents/SimpleButtonDropdownMenu';

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
        testId="AddStopDropdownOption::addBusStop"
        onClick={() => onAddStops(ReusableComponentsVehicleModeEnum.Bus)}
      >
        {t('map.addBusStop')}
      </SimpleDropdownMenuItem>
      <SimpleDropdownMenuItem
        testId="AddStopDropdownOption::addTramStop"
        onClick={() => onAddStops(ReusableComponentsVehicleModeEnum.Tram)}
      >
        {t('map.addTramStop')}
      </SimpleDropdownMenuItem>
    </SimpleButtonDropdownMenu>
  );
};
