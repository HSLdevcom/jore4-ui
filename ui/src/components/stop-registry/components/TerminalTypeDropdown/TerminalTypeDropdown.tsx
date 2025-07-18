import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapTerminalTypeToUiName } from '../../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../../uiComponents';
import { EnumDropdown } from '../../../forms/common';
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
      placeholder={t('terminal.chooseTerminalType')}
      uiNameMapper={(val) => mapTerminalTypeToUiName(t, val)}
      value={value ?? ''} // Replace undefined value with empty string to avoid error
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};
