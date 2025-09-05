import { Dispatch, SetStateAction } from 'react';
import { PagingInfo } from '../../../../types';
import { SortingInfo } from './SortingInfo';
import { SortStopsBy } from './SortStopsBy';

export type CountAndSortingRowProps = {
  readonly className?: string;
  readonly resultCount: number;
  readonly sortingInfo: SortingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
};

export const commonSortingFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.LABEL,
  SortStopsBy.NAME,
  SortStopsBy.ADDRESS,
];
