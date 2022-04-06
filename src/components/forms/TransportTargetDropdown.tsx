import { useTranslation } from 'react-i18next';
import { HslRouteTransportTargetEnum } from '../../generated/graphql';
import { mapTransportTargetToUiName } from '../../i18n/uiNameMappings';
import { FormInputProps } from '../../uiComponents';
import { EnumDropdown } from './EnumDropdown';

interface Props extends FormInputProps {
  testId?: string;
}

export const TransportTargetDropdown = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<HslRouteTransportTargetEnum>
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      enumType={HslRouteTransportTargetEnum}
      placeholder={t('lines.transportTarget')}
      uiNameMapper={mapTransportTargetToUiName}
    />
  );
};
