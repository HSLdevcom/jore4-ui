import { ChangeEventHandler, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteTypeOfLineEnum } from '../../../../generated/graphql';
import { Column } from '../../../../layoutComponents';
import { AllOptionEnum } from '../../../../utils';
import { LineTypeDropdown } from '../../../forms/line/LineTypeDropdown';

type LineTypeConditionProps = {
  readonly value: AllOptionEnum | RouteTypeOfLineEnum;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export const LineTypeCondition: FC<LineTypeConditionProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const typeOfLineDropdownId = 'search.typeOfLine';

  return (
    <Column className="min-w-48">
      <label htmlFor={typeOfLineDropdownId}>{t(`lines.typeOfLine`)}</label>
      <LineTypeDropdown
        id={typeOfLineDropdownId}
        onChange={onChange}
        includeAllOption
        value={value}
      />
    </Column>
  );
};
