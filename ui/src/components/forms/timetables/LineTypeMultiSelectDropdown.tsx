import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../../generated/graphql';
import { mapLineTypeToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { EnumMultiSelectDropdown } from '../common/EnumMultiSelectDropdown';

interface Props extends FormInputProps {
  id?: string;
  testId: string;
}

export const LineTypeMultiSelectDropdown = ({
  id,
  testId,
  ...formInputProps
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <EnumMultiSelectDropdown
      id={id}
      testId={testId}
      enumType={RouteTypeOfLineEnum}
      placeholder={t('lines.chooseTypeOfLine')}
      uiNameMapper={mapLineTypeToUiName}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
