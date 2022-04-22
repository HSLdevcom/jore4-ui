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
  value,
  onChange,
  onBlur,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<ReusableComponentsVehicleModeEnum>
      testId={testId}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      enumType={ReusableComponentsVehicleModeEnum}
      placeholder={t('lines.chooseVehicleMode')}
      uiNameMapper={mapVehicleModeToUiName}
    />
  );
};
