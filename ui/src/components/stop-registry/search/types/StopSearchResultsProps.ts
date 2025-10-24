import { Dispatch, SetStateAction } from 'react';
import { PagingInfo } from '../../../../types';
import { SortingInfo } from './SortingInfo';
import { StopSearchFilters } from './StopSearchFilters';
import { StopSearchHistoryState } from './StopSearchHistoryState';

export type StopSearchResultsProps = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
};

export type ExtendedStopSearchResultsProps = StopSearchResultsProps & {
  readonly historyState: StopSearchHistoryState;
  readonly setHistoryState: Dispatch<SetStateAction<StopSearchHistoryState>>;
};
