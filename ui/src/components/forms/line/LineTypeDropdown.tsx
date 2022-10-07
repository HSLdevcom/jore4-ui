import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../../generated/graphql';
import { mapLineTypeToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common/EnumDropdown';

interface Props extends FormInputProps {
  id?: string;
  testId?: string;
  includeAllOption?: boolean;
}

export const LineTypeDropdown = ({
  id,
  testId,
  includeAllOption,
  ...formInputProps
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<RouteTypeOfLineEnum>
      id={id}
      testId={testId}
      enumType={RouteTypeOfLineEnum}
      placeholder={t('lines.chooseTypeOfLine')}
      uiNameMapper={mapLineTypeToUiName}
      includeAllOption={includeAllOption}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
