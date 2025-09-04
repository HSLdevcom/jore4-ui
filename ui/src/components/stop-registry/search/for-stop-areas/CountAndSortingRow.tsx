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
  SortStopsBy.BY_STOP_AREA,
];

const groupOnlyFields: ReadonlyArray<SortStopsBy> = [SortStopsBy.BY_STOP_AREA];

export const CountAndSortingRow: FC<CountAndSortingRowProps> = ({
  className,
  resultCount,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { sortBy } = sortingInfo;

  return (
    <div className={twMerge('flex items-center justify-between', className)}>
      {sortBy === SortStopsBy.DEFAULT || sortBy === SortStopsBy.BY_STOP_AREA ? (
        <div />
      ) : (
        <ResultCountHeader resultCount={resultCount} />
      )}

      <SortResultsBy
        groupOnlyFields={groupOnlyFields}
        mapDefaultTo={SortStopsBy.BY_STOP_AREA}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        supportedFields={supportedSortingFields}
      />
    </div>
  );
};
