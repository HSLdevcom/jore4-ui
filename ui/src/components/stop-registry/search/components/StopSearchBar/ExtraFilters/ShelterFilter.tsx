import { FC } from 'react';
import { useController } from 'react-hook-form';
import { StopRegistryShelterType } from '../../../../../../generated/graphql';
import { mapStopRegistryShelterTypeEnumToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { AllOptionEnum, NullOptionEnum } from '../../../../../../utils';
import { InputLabel, ValidationErrorList } from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import { EnumFilter } from './EnumFilter';

const options: ReadonlyArray<
  StopRegistryShelterType | AllOptionEnum | NullOptionEnum
> = [
  AllOptionEnum.All,
  ...Object.values(StopRegistryShelterType),
  NullOptionEnum.Null,
];

const uiNameMapper = mapStopRegistryShelterTypeEnumToUiName.extend({
  [AllOptionEnum.All]: (t) => t('all'),
  [NullOptionEnum.Null]: (t) => t('stopRegistrySearch.noOptions.shelter'),
});

const defaultValue: ReadonlyArray<
  StopRegistryShelterType | AllOptionEnum | NullOptionEnum
> = [AllOptionEnum.All];

export const ShelterFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const {
    field: { onChange, onBlur, value },
  } = useController<StopSearchFilters, 'shelter'>({
    name: 'shelter',
    disabled,
  });

  return (
    <Column className={className}>
      <InputLabel<StopSearchFilters>
        fieldPath="shelter"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <EnumFilter
        id="stopRegistrySearch.fieldLabels.shelter"
        defaultValue={defaultValue}
        disabled={disabled}
        options={options}
        onBlur={onBlur}
        onChange={onChange}
        testId={stopSearchBarTestIds.shelterFilter}
        uiNameMapper={uiNameMapper}
        value={value}
      />

      <ValidationErrorList fieldPath="shelter" />
    </Column>
  );
};
