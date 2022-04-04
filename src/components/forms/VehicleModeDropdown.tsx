import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { mapVehicleModeToUiName } from '../../i18n/uiNameMappings';
import { FormInputProps } from '../../uiComponents';
import { EnumDropdown } from './EnumDropdown';

interface Props extends FormInputProps {
  testId?: string;
}

export const VehicleModeDropdown = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<ReusableComponentsVehicleModeEnum>
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      enumType={ReusableComponentsVehicleModeEnum}
      placeholder={t('lines.chooseVehicleMode')}
      uiNameMapper={mapVehicleModeToUiName}
    />
  );
};
