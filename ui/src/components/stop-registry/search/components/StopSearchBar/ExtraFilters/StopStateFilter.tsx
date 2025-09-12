import { FC } from 'react';
import { useController } from 'react-hook-form';
import { mapStopPlaceStateToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import { AllOptionEnum } from '../../../../../../utils';
import { InputLabel, ValidationErrorList } from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import { EnumFilter } from './EnumFilter';

const options: ReadonlyArray<StopPlaceState | AllOptionEnum> = [
  AllOptionEnum.All,
  ...Object.values(StopPlaceState),
];

const uiNameMapper = mapStopPlaceStateToUiName.extend({
  [AllOptionEnum.All]: (t) => t('all'),
});

const defaultValue: ReadonlyArray<StopPlaceState | AllOptionEnum> = [
  AllOptionEnum.All,
];

export const StopStateFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const {
    field: { onChange, onBlur, value },
  } = useController<StopSearchFilters, 'stopState'>({
    name: 'stopState',
    disabled,
  });

  return (
    <Column className={className}>
      <InputLabel<StopSearchFilters>
        fieldPath="stopState"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <EnumFilter
        id="stopRegistrySearch.fieldLabels.stopState"
        defaultValue={defaultValue}
        disabled={disabled}
        options={options}
        onBlur={onBlur}
        onChange={onChange}
        testId={stopSearchBarTestIds.stopStateFilter}
        uiNameMapper={uiNameMapper}
        value={value}
      />

      <ValidationErrorList fieldPath="stopState" />
    </Column>
  );
};
