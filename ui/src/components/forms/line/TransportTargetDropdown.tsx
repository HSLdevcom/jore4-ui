import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { HslRouteTransportTargetEnum } from '../../../generated/graphql';
import { mapTransportTargetToUiName } from '../../../utils/i18n';
import { EnumDropdown } from '../../common/Dropdowns';
import { FormInputProps } from '../../common/Inputs';

type TransportTargetDropdownProps = FormInputProps & {
  readonly testId?: string;
};

export const TransportTargetDropdown: FC<TransportTargetDropdownProps> = ({
  testId,
  ...formInputProps
}) => {
  const { t } = useTranslation();

  return (
    <EnumDropdown<HslRouteTransportTargetEnum>
      testId={testId}
      enumType={HslRouteTransportTargetEnum}
      placeholder={t(($) => $.lines.transportTarget)}
      uiNameMapper={(value) => mapTransportTargetToUiName(t, value)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
