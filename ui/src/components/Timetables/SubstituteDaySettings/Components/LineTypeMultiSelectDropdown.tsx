import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../../../generated/graphql';
import { AllOptionEnum } from '../../../../utils';
import { mapLineTypeToUiName } from '../../../../utils/i18n';
import { EnumMultiSelectDropdown } from '../../../common/Dropdowns';
import { ValueFn } from '../../../common/Inputs';

type LineTypeMultiSelectDropdownProps = {
  readonly id?: string;
  readonly testId: string;
  readonly value?: ReadonlyArray<RouteTypeOfLineEnum | AllOptionEnum>;
  readonly onChange: ValueFn;
};

export const LineTypeMultiSelectDropdown: FC<
  LineTypeMultiSelectDropdownProps
> = ({ id, testId, ...formInputProps }) => {
  const { t } = useTranslation();

  return (
    <EnumMultiSelectDropdown
      id={id}
      testId={testId}
      enumType={RouteTypeOfLineEnum}
      placeholder={t(($) => $.lines.chooseTypeOfLine)}
      includeAllOption
      uiNameMapper={(value: RouteTypeOfLineEnum | AllOptionEnum) =>
        mapLineTypeToUiName(t, value)
      }
      {...formInputProps}
    />
  );
};
