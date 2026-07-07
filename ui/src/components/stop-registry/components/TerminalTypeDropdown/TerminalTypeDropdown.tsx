import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapTerminalTypeToUiName } from '../../../../utils/i18n';
import { EnumDropdown } from '../../../common/Dropdowns';
import { FormInputProps } from '../../../common/Inputs';
import { TerminalType } from '../../types/TerminalType';

type TerminalTypeDropdownProps = FormInputProps;

export const TerminalTypeDropdown: FC<TerminalTypeDropdownProps> = ({
  value,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<TerminalType>
      enumType={TerminalType}
      placeholder={t(($) => $.terminal.chooseTerminalType)}
      uiNameMapper={(val) => mapTerminalTypeToUiName(t, val)}
      value={value}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};
