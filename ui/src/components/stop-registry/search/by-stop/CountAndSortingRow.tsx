import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopSearchRow } from '../../components';
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
];

type CountAndSortingRowProps = {
  readonly allSelected: boolean;
  readonly className?: string;
  readonly filters: StopSearchFilters;
  readonly onToggleSelectAll: () => void;
  readonly resultCount: number;
  readonly resultSelection: ResultSelection;
  readonly sortingInfo: SortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

export const CountAndSortingRow: FC<CountAndSortingRowProps> = ({
  allSelected,
  className,
  filters,
  onToggleSelectAll,
  resultCount,
  resultSelection,
  setSortingInfo,
  sortingInfo,
  stops,
}) => {
  return (
    <div className={twMerge('flex items-center gap-5', className)}>
      <SelectAllCheckbox
        allSelected={allSelected}
        onToggleSelectAll={onToggleSelectAll}
      />

      <ResultCountHeader resultCount={resultCount} />

      <OpenStopResultsOnMapButton
        filters={filters}
        hasResults={resultCount > 0}
        resultCount={resultCount}
        resultSelection={resultSelection}
        results={stops}
      />

      <div className="flex-grow" />

      <SortResultsBy
        mapDefaultTo={SortStopsBy.LABEL}
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
