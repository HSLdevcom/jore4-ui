import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { SimpleDropdownMenuItem } from '../../uiComponents';
import { SimpleButtonDropdownMenu } from '../../uiComponents/SimpleButtonDropdownMenu';

const testIds: Readonly<Record<string, string>> = {
  addBusStop: 'AddStopDropdownOption::addBusStop',
  addTramStop: 'AddStopDropdownOption::addTramStop',
};

type MapFooterAddStopDropdownProps = {
  readonly onAddStops: (vehicleMode: ReusableComponentsVehicleModeEnum) => void;
  readonly testId: string;
  readonly disabled?: boolean;
  readonly inverted?: boolean;
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
        data-vehicle-mode={ReusableComponentsVehicleModeEnum.Bus}
        onClick={() => onAddStops(ReusableComponentsVehicleModeEnum.Bus)}
      >
        {t('map.addBusStop')}
      </SimpleDropdownMenuItem>
      <SimpleDropdownMenuItem
        testId={testIds.addTramStop}
        data-vehicle-mode={ReusableComponentsVehicleModeEnum.Tram}
        onClick={() => onAddStops(ReusableComponentsVehicleModeEnum.Tram)}
      >
        {t('map.addTramStop')}
      </SimpleDropdownMenuItem>
    </SimpleButtonDropdownMenu>
  );
};
