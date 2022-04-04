import { useTranslation } from 'react-i18next';
import { mapDirectionToUiName } from '../../i18n/uiNameMappings';
import { RouteDirection } from '../../types/RouteDirection';
import { FormInputProps } from '../../uiComponents';
import { EnumDropdown } from './EnumDropdown';

interface Props extends FormInputProps {
  id?: string;
}

export const DirectionDropdown = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      enumType={RouteDirection}
      placeholder={t('routes.chooseDirection')}
      uiNameMapper={mapDirectionToUiName}
    />
  );
};
