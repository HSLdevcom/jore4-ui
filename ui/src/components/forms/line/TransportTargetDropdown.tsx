import { useTranslation } from 'react-i18next';
import { HslRouteTransportTargetEnum } from '../../../generated/graphql';
import { mapTransportTargetToUiName } from '../../../i18n/uiNameMappings';
import { FormInputProps } from '../../../uiComponents';
import { EnumDropdown } from '../common/EnumDropdown';

interface Props extends FormInputProps {
  testId?: string;
}

export const TransportTargetDropdown = ({
  testId,
  ...formInputProps
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<HslRouteTransportTargetEnum>
      testId={testId}
      enumType={HslRouteTransportTargetEnum}
      placeholder={t('lines.transportTarget')}
      uiNameMapper={(value) => mapTransportTargetToUiName(t, value)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
