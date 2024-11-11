import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { PagingInfo } from '../../../../types';
import { ResultCountHeader } from '../components/ResultCountHeader';
import { SortResultsBy } from '../components/SortResultsBy';
import { SortStopsBy, SortingInfo } from '../types';

const supportedSortingFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.LABEL,
  SortStopsBy.NAME,
  SortStopsBy.ADDRESS,
  SortStopsBy.BY_STOP_AREA,
];

const groupOnlyFields: ReadonlyArray<SortStopsBy> = [SortStopsBy.BY_STOP_AREA];

type CountAndSortingRowProps = {
  readonly className?: string;
  readonly resultCount: number;
  readonly sortingInfo: SortingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
};

export const CountAndSortingRow: FC<CountAndSortingRowProps> = ({
  className,
  resultCount,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { sortBy } = sortingInfo;

  return (
    <div className={twMerge('a flex items-center justify-between', className)}>
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
