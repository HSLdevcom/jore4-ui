import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { mapVehicleModeToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common/EnumDropdown';

interface Props extends FormInputProps {
  testId?: string;
}

export const VehicleModeDropdown = ({
  testId,
  ...formInputProps
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<ReusableComponentsVehicleModeEnum>
      testId={testId}
      enumType={ReusableComponentsVehicleModeEnum}
      placeholder={t('lines.chooseVehicleMode')}
      uiNameMapper={mapVehicleModeToUiName}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
