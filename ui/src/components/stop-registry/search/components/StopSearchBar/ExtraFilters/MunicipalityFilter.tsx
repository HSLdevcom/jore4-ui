import { TFunction } from 'i18next';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { Column } from '../../../../../../layoutComponents';
import { AllOptionEnum } from '../../../../../../utils';
import { InputLabel, ValidationErrorList } from '../../../../../forms/common';
import {
  StopSearchFilters,
  StringMunicipality,
  knownMunicipalities,
} from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import { EnumFilter } from './EnumFilter';

type Option = StringMunicipality | AllOptionEnum.All;

const options: ReadonlyArray<Option> = [
  AllOptionEnum.All,
  ...knownMunicipalities,
];

function uiNameMapper(t: TFunction, value: Option): string {
  if (value === AllOptionEnum.All) {
    return t('all');
  }

  return value;
}

const defaultValue: ReadonlyArray<Option> = [AllOptionEnum.All];

export const MunicipalityFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const {
    field: { onBlur, onChange, value },
  } = useController<StopSearchFilters, 'municipalities'>({
    name: 'municipalities',
    disabled,
  });

  return (
    <Column className={className}>
      <InputLabel<StopSearchFilters>
        fieldPath="municipalities"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <EnumFilter
        defaultValue={defaultValue}
        id="stopRegistrySearch.fieldLabels.municipalities"
        options={options}
        onBlur={onBlur}
        onChange={onChange}
        testId={stopSearchBarTestIds.municipalitiesFilter}
        uiNameMapper={uiNameMapper}
        value={value}
      />

      <ValidationErrorList<StopSearchFilters> fieldPath="municipalities" />
    </Column>
  );
};
