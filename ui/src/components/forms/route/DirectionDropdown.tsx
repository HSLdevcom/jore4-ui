import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapDirectionToUiName } from '../../../i18n/uiNameMappings';
import { RouteDirection } from '../../../types/RouteDirection';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common/EnumDropdown';

type DirectionDropdownProps = FormInputProps & {
  readonly testId?: string;
};

export const DirectionDropdown: FC<DirectionDropdownProps> = ({
  testId,
  value,
  onChange,
  onBlur,
}) => {
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
