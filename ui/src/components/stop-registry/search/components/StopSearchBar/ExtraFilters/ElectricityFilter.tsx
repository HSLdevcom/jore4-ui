import { FC } from 'react';
import { useController } from 'react-hook-form';
import { StopRegistryShelterElectricity } from '../../../../../../generated/graphql';
import { mapStopRegistryShelterElectricityEnumToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { AllOptionEnum, NullOptionEnum } from '../../../../../../utils';
import { InputLabel, ValidationErrorList } from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import { EnumFilter } from './EnumFilter';

const options: ReadonlyArray<
  StopRegistryShelterElectricity | AllOptionEnum | NullOptionEnum
> = [
  AllOptionEnum.All,
  ...Object.values(StopRegistryShelterElectricity),
  NullOptionEnum.Null,
];

const uiNameMapper = mapStopRegistryShelterElectricityEnumToUiName.extend({
  [AllOptionEnum.All]: (t) => t('all'),
  [NullOptionEnum.Null]: (t) => t('stopRegistrySearch.noOptions.electricity'),
});

const defaultValue: ReadonlyArray<
  StopRegistryShelterElectricity | AllOptionEnum | NullOptionEnum
> = [AllOptionEnum.All];

export const ElectricityFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const {
    field: { onChange, onBlur, value },
  } = useController<StopSearchFilters, 'electricity'>({
    name: 'electricity',
    disabled,
  });

  return (
    <Column className={className}>
      <InputLabel<StopSearchFilters>
        fieldPath="electricity"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <EnumFilter
        id="stopRegistrySearch.fieldLabels.electricity"
        defaultValue={defaultValue}
        disabled={disabled}
        options={options}
        onBlur={onBlur}
        onChange={onChange}
        testId={stopSearchBarTestIds.electricityFilter}
        uiNameMapper={uiNameMapper}
        value={value}
      />

      <ValidationErrorList fieldPath="electricity" />
    </Column>
  );
};
