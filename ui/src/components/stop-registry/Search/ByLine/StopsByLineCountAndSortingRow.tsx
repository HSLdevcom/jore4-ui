import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { PagingInfo } from '../../../../types';
import { OpenStopResultsOnMapButton } from '../Components/OpenStopResultsOnMapButton';
import { ResultCountHeader } from '../Components/ResultCountHeader';
import { ResultsActionMenu } from '../Components/ResultsActionMenu';
import { SelectAllCheckbox } from '../Components/SelectAllCheckbox';
import { SortResultsBy } from '../Components/SortResultsBy';
import {
  ResultSelection,
  SortStopsBy,
  SortingInfo,
  StopSearchFilters,
} from '../Types';

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

      <div className="grow" />

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
