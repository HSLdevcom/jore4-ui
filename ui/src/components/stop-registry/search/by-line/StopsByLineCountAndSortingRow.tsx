import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { PagingInfo } from '../../../../types';
import { OpenStopResultsOnMapButton } from '../components/OpenStopResultsOnMapButton';
import { ResultCountHeader } from '../components/ResultCountHeader';
import { ResultsActionMenu } from '../components/ResultsActionMenu';
import { SelectAllCheckbox } from '../components/SelectAllCheckbox';
import { SortResultsBy } from '../components/SortResultsBy';
import {
  ResultSelection,
  SortStopsBy,
  SortingInfo,
  StopSearchFilters,
} from '../types';

const supportedSortingFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.LABEL,
  SortStopsBy.NAME,
  SortStopsBy.ADDRESS,
  SortStopsBy.SEQUENCE_NUMBER,
];

const groupOnlyFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.SEQUENCE_NUMBER,
];

type StopsByLineCountAndSortingRow = {
  readonly filters: StopSearchFilters;
  readonly allSelected: boolean;
  readonly className?: string;
  readonly onToggleSelectAll: () => void;
  readonly hasResults: boolean;
  readonly resultCount: number;
  readonly resultSelection: ResultSelection;
  readonly sortingInfo: SortingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
};

export const StopsByLineCountAndSortingRow: FC<
  StopsByLineCountAndSortingRow
> = ({
  filters,
  className,
  resultCount,
  setPagingInfo,
  setSortingInfo,
  resultSelection,
  sortingInfo,
  hasResults,
  allSelected,
  onToggleSelectAll,
}) => {
  const { sortBy } = sortingInfo;

  return (
    <div className={twMerge('a flex items-center gap-5', className)}>
      {hasResults && (
        <SelectAllCheckbox
          allSelected={allSelected}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}

      {sortBy === SortStopsBy.DEFAULT ||
      sortBy === SortStopsBy.SEQUENCE_NUMBER ? null : (
        <ResultCountHeader resultCount={resultCount} />
      )}

      <OpenStopResultsOnMapButton
        filters={filters}
        hasResults={hasResults}
        resultSelection={resultSelection}
      />

      <div className="flex-grow" />

      <SortResultsBy
        groupOnlyFields={groupOnlyFields}
        mapDefaultTo={SortStopsBy.SEQUENCE_NUMBER}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        supportedFields={supportedSortingFields}
      />

      <ResultsActionMenu
        filters={filters}
        resultCount={resultCount}
        resultSelection={resultSelection}
      />
    </div>
  );
};
