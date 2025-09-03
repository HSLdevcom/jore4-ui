import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { ResultCountHeader } from '../components/ResultCountHeader';
import { SortResultsBy } from '../components/SortResultsBy';
import { SortStopsBy } from '../types';
import {
  CountAndSortingRowProps,
  commonSortingFields,
} from '../types/CountAndSortingRow';

const supportedSortingFields: ReadonlyArray<SortStopsBy> = [
  ...commonSortingFields,
  SortStopsBy.BY_TERMINAL,
];

const groupOnlyFields: ReadonlyArray<SortStopsBy> = [SortStopsBy.BY_TERMINAL];

export const TerminalCountAndSortingRow: FC<CountAndSortingRowProps> = ({
  className,
  resultCount,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { sortBy } = sortingInfo;

  return (
    <div className={twMerge('a flex items-center justify-between', className)}>
      {sortBy === SortStopsBy.DEFAULT || sortBy === SortStopsBy.BY_TERMINAL ? (
        <div />
      ) : (
        <ResultCountHeader resultCount={resultCount} />
      )}

      <SortResultsBy
        groupOnlyFields={groupOnlyFields}
        mapDefaultTo={SortStopsBy.BY_TERMINAL}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        supportedFields={supportedSortingFields}
      />
    </div>
  );
};
