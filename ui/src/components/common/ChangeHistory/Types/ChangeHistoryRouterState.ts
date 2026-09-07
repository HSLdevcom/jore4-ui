import { PagingInfo } from '../../../../types';
import { ChangeHistoryFilters } from './ChangeHistoryFilters';
import { ChangeHistorySortingInfo } from './ChangeHistorySortingInfo';

export type ChangeHistoryRouterState = {
  readonly filters: ChangeHistoryFilters;
  readonly pagingInfo: PagingInfo;
  readonly sortingInfo: ChangeHistorySortingInfo;
};
