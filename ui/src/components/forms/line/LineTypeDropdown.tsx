import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../../generated/graphql';
import { mapLineTypeToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { AllOptionEnum } from '../../../utils';
import { EnumDropdown } from '../common';

type LineTypeDropdownProps = FormInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly includeAllOption?: boolean;
};

export const LineTypeDropdown: FC<LineTypeDropdownProps> = ({
  id,
  testId,
  includeAllOption,
  ...formInputProps
}) => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<RouteTypeOfLineEnum | AllOptionEnum.All>
      id={id}
      testId={testId}
      enumType={RouteTypeOfLineEnum}
      placeholder={t('lines.chooseTypeOfLine')}
      uiNameMapper={(value) => mapLineTypeToUiName(t, value)}
      includeAllOption={!!includeAllOption}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
