import { FC } from 'react';
import { InputField } from '../../../../../common/Inputs';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';

export const ElyFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => (
  <InputField<StopSearchFilters>
    className={className}
    inputClassName="grow"
    disabled={disabled}
    fieldPath="elyNumber"
    translationPrefix="stopRegistrySearch.fieldLabels"
    testId={stopSearchBarTestIds.elyInput}
    type="text"
  />
);
