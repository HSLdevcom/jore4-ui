import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { ResultCountHeader } from '../components/ResultCountHeader';
import { SortResultsBy } from '../components/SortResultsBy';
import { SortStopsBy, SortingInfo } from '../types';

const supportedSortingFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.LABEL,
  SortStopsBy.NAME,
  SortStopsBy.ADDRESS,
];

type CountAndSortingRowProps = {
  readonly className?: string;
  readonly resultCount: number;
  readonly sortingInfo: SortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
};

export const CountAndSortingRow: FC<CountAndSortingRowProps> = ({
  className,
  resultCount,
  setSortingInfo,
  sortingInfo,
}) => {
  return (
    <div className={twMerge('a flex items-center justify-between', className)}>
      <ResultCountHeader resultCount={resultCount} />
      <SortResultsBy
        mapDefaultTo={SortStopsBy.LABEL}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        supportedFields={supportedSortingFields}
      />
    </div>
  );
};
