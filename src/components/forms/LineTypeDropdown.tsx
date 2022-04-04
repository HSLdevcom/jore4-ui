import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../generated/graphql';
import { FormInputProps } from '../../uiComponents';
import { EnumDropdown } from './EnumDropdown';

interface Props extends FormInputProps {
  id?: string;
}

export const LineTypeDropdown = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      values={Object.values(RouteTypeOfLineEnum)}
      placeholder={t('lines.chooseLinesType')}
      translationPrefix="lineTypeEnum."
    />
  );
};
