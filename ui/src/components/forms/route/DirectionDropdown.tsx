import { useTranslation } from 'react-i18next';
import { mapDirectionToUiName } from '../../../i18n/uiNameMappings';
import { RouteDirection } from '../../../types/RouteDirection';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common/EnumDropdown';

interface Props extends FormInputProps {
  testId?: string;
}

export const DirectionDropdown = ({
  testId,
  value,
  onChange,
  onBlur,
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <EnumDropdown
      testId={testId}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      enumType={RouteDirection}
      placeholder={t('routes.chooseDirection')}
      uiNameMapper={(direction) => mapDirectionToUiName(t, direction)}
    />
  );
};
