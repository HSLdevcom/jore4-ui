import { SortOrder } from '../../../../types';
import { SortChangeHistoryBy } from './SortChangeHistoryBy';

export type ChangeHistorySortingInfo = {
  readonly sortBy: SortChangeHistoryBy;
  readonly sortOrder: SortOrder;
};

export const defaultChangeHistorySortingInfo: ChangeHistorySortingInfo = {
  sortBy: SortChangeHistoryBy.Changed,
  sortOrder: SortOrder.DESCENDING,
};
