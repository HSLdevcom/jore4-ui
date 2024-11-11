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
  SortStopsBy.SEQUENCE_NUMBER,
];

const groupOnlyFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.SEQUENCE_NUMBER,
];

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
      {sortBy === SortStopsBy.DEFAULT ||
      sortBy === SortStopsBy.SEQUENCE_NUMBER ? (
        <div />
      ) : (
        <ResultCountHeader resultCount={resultCount} />
      )}

      <SortResultsBy
        groupOnlyFields={groupOnlyFields}
        mapDefaultTo={SortStopsBy.SEQUENCE_NUMBER}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        supportedFields={supportedSortingFields}
      />
    </div>
  );
};
