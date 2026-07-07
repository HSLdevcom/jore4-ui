import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SubstituteDayOfWeek } from '../../../types/enums';
import { AllOptionEnum } from '../../../utils';
import { mapSubstituteDayOfWeekToUiName } from '../../../utils/i18n';
import { EnumDropdown } from '../../common/Dropdowns';
import { FormInputProps } from '../../common/Inputs';

type SubstituteDayOfWeekDropdownProps = FormInputProps & {
  readonly id?: string;
  readonly testId: string;
  readonly includeAllOption?: boolean;
};

export const SubstituteDayOfWeekDropdown: FC<
  SubstituteDayOfWeekDropdownProps
> = ({ id, testId, includeAllOption, ...formInputProps }) => {
  const { t } = useTranslation();
  return (
    <EnumDropdown<SubstituteDayOfWeek | AllOptionEnum.All>
      id={id}
      testId={testId}
      enumType={SubstituteDayOfWeek}
      placeholder={t(($) => $.timetables.chooseSubstituteDay)}
      uiNameMapper={(value) => mapSubstituteDayOfWeekToUiName(t, value)}
      includeAllOption={!!includeAllOption}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
