import { useTranslation } from 'react-i18next';
import { mapSubstituteDayOfWeekToUiName } from '../../../i18n/uiNameMappings';
import { SubstituteDayOfWeek } from '../../../types/enums';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common';

interface Props extends FormInputProps {
  id?: string;
  testId: string;
  includeAllOption?: boolean;
}

export const SubstituteDayOfWeekDropdown = ({
  id,
  testId,
  includeAllOption,
  ...formInputProps
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <EnumDropdown
      id={id}
      testId={testId}
      enumType={SubstituteDayOfWeek}
      placeholder={t('timetables.chooseSubstituteDay')}
      uiNameMapper={mapSubstituteDayOfWeekToUiName}
      includeAllOption={!!includeAllOption}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
