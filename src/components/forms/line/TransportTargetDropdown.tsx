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
  value,
  onChange,
  onBlur,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<HslRouteTransportTargetEnum>
      testId={testId}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      enumType={HslRouteTransportTargetEnum}
      placeholder={t('lines.transportTarget')}
      uiNameMapper={mapTransportTargetToUiName}
    />
  );
};
