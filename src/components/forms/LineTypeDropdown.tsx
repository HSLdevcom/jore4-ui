import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../generated/graphql';
import { mapLineTypeToUiName } from '../../i18n/uiNameMappings';
import { FormInputProps } from '../../uiComponents';
import { EnumDropdown } from './EnumDropdown';

interface Props extends FormInputProps {
  testId?: string;
}

export const LineTypeDropdown = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<RouteTypeOfLineEnum>
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      placeholder={t('lines.chooseLinesType')}
      enumType={RouteTypeOfLineEnum}
      uiNameMapper={mapLineTypeToUiName}
    />
  );
};
