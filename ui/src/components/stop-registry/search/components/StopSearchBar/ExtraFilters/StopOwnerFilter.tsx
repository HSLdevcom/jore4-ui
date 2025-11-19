import { FC } from 'react';
import { useController } from 'react-hook-form';
import { mapStopOwnerToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { StopOwner } from '../../../../../../types/stop-registry';
import { AllOptionEnum } from '../../../../../../utils';
import { InputLabel, ValidationErrorList } from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import { EnumFilter } from './EnumFilter';

const options: ReadonlyArray<StopOwner | AllOptionEnum> = [
  AllOptionEnum.All,
  ...Object.values(StopOwner),
];

const uiNameMapper = mapStopOwnerToUiName.extend({
  [AllOptionEnum.All]: (t) => t('all'),
});

const defaultValue: ReadonlyArray<StopOwner | AllOptionEnum> = [
  AllOptionEnum.All,
];

export const StopOwnerFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const {
    field: { onChange, onBlur, value },
  } = useController<StopSearchFilters, 'stopOwner'>({
    name: 'stopOwner',
    disabled,
  });

  return (
    <Column className={className}>
      <InputLabel<StopSearchFilters>
        fieldPath="stopOwner"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <EnumFilter
        id="stopRegistrySearch.fieldLabels.stopOwner"
        defaultValue={defaultValue}
        disabled={disabled}
        options={options}
        onBlur={onBlur}
        onChange={onChange}
        testId={stopSearchBarTestIds.stopOwnerFilter}
        uiNameMapper={uiNameMapper}
        value={value}
      />

      <ValidationErrorList fieldPath="stopOwner" />
    </Column>
  );
};
