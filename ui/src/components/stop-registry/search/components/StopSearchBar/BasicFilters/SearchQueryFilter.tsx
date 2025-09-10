import { FC } from 'react';
import { InputField } from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { ClassNameProps } from '../Types/ClassNameProps';

export const SearchQueryFilter: FC<ClassNameProps> = ({ className }) => (
  <InputField<StopSearchFilters>
    className={className}
    fieldPath="query"
    translationPrefix="stopRegistrySearch.fieldLabels"
    testId={stopSearchBarTestIds.searchInput}
    type="search"
  />
);
