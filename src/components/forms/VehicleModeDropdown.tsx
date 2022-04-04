import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { FormInputProps } from '../../uiComponents';
import { EnumDropdown } from './EnumDropdown';

interface Props extends FormInputProps {
  id?: string;
}

export const VehicleModeDropdown = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      values={Object.values(ReusableComponentsVehicleModeEnum)}
      placeholder={t('lines.chooseVehicleMode')}
      translationPrefix="vehicleModeEnum."
    />
  );
};
