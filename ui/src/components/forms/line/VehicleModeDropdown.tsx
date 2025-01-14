import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { mapVehicleModeToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common/EnumDropdown';

interface Props extends FormInputProps {
  id?: string;
  testId?: string;
  includeAllOption?: boolean;
}

/** Creates VehicleModeDropdown from ReusableComponentsVehicleModeEnum. This Dropdown can be
 * enrichted with 'All' option by giving it includeAllOption flag as true.
 */
export const VehicleModeDropdown = ({
  id,
  testId,
  includeAllOption,
  ...formInputProps
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <EnumDropdown
      id={id}
      testId={testId}
      enumType={ReusableComponentsVehicleModeEnum}
      placeholder={t('lines.chooseVehicleMode')}
      uiNameMapper={mapVehicleModeToUiName}
      includeAllOption={!!includeAllOption}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
