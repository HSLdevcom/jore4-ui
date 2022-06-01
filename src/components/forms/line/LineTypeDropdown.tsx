import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../../generated/graphql';
import { mapLineTypeToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common/EnumDropdown';

interface Props extends FormInputProps {
  testId?: string;
}

export const LineTypeDropdown = ({
  testId,
  ...formInputProps
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<RouteTypeOfLineEnum>
      testId={testId}
      enumType={RouteTypeOfLineEnum}
      placeholder={t('lines.chooseTypeOfLine')}
      uiNameMapper={mapLineTypeToUiName}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
