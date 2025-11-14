import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Column, Row } from '../../../../../../layoutComponents';
import {
  ExtraFiltersToggle,
  SearchQueryFilter,
} from '../../../../../common/search/SearchBar';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { ObservationDateFilter } from './ObservationDateFilter';
import { SearchCriteriaRadioButtons } from './SearchCriteriaRadioButtons';
import { SearchForDropdown } from './SearchForDropdown';

type BasicFilterProps = {
  readonly className?: string;
  readonly extraFiltersId: string;
  readonly searchIsExpanded: boolean;
  readonly toggleSearchIsExpanded: () => void;
};

export const BasicFilters: FC<BasicFilterProps> = ({
  className,
  extraFiltersId,
  searchIsExpanded,
  toggleSearchIsExpanded,
}) => {
  return (
    <Column
      className={twMerge(
        'items-stretch gap-y-4 bg-background px-10 py-4',
        className,
      )}
    >
      <Row className="justify-center gap-x-4">
        <ObservationDateFilter className="min-w-40" />
        <SearchForDropdown className="min-w-40 xl:w-1/6" />
        <SearchQueryFilter<StopSearchFilters>
          testIdPrefix={stopSearchBarTestIds.prefix}
          fieldPath="query"
          translationPrefix="stopRegistrySearch.fieldLabels"
          className="w-4/6 xl:w-2/6"
        />

        <ExtraFiltersToggle
          className="mt-[25px]"
          extraFiltersId={extraFiltersId}
          searchIsExpanded={searchIsExpanded}
          toggleSearchIsExpanded={toggleSearchIsExpanded}
          testIdPrefix={stopSearchBarTestIds.prefix}
        />
      </Row>

      <Row className="justify-center">
        <SearchCriteriaRadioButtons />
      </Row>
    </Column>
  );
};
