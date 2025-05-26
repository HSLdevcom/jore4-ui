import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { mapVehicleModeToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { AllOptionEnum } from '../../../utils';
import { EnumDropdown } from '../common/EnumDropdown';

type VehicleModeDropdownProps = FormInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly includeAllOption?: boolean;
};

/** Creates VehicleModeDropdown from ReusableComponentsVehicleModeEnum. This Dropdown can be
 * enrichted with 'All' option by giving it includeAllOption flag as true.
 */
export const VehicleModeDropdown: FC<VehicleModeDropdownProps> = ({
  id,
  testId,
  includeAllOption,
  ...formInputProps
}) => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<ReusableComponentsVehicleModeEnum | AllOptionEnum.All>
      id={id}
      testId={testId}
      enumType={ReusableComponentsVehicleModeEnum}
      placeholder={t('lines.chooseVehicleMode')}
      uiNameMapper={(value) => mapVehicleModeToUiName(t, value)}
      includeAllOption={!!includeAllOption}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
