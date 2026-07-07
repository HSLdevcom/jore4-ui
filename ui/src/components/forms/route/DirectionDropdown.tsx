import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteDirection } from '../../../types/RouteDirection';
import { mapDirectionToUiName } from '../../../utils/i18n';
import { EnumDropdown } from '../../common/Dropdowns';
import { FormInputProps } from '../../common/Inputs';

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
      placeholder={t(($) => $.routes.chooseDirection)}
      uiNameMapper={(direction) => mapDirectionToUiName(t, direction)}
    />
  );
};
