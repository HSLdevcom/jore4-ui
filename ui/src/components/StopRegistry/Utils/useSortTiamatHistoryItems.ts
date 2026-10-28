import { useMemo } from 'react';
import { useCollator } from '../../../utils';
import { isDateInRange, parseDateTime } from '../../../utils/time';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
  GetUserNameById,
  SortChangeHistoryBy,
} from '../../common/ChangeHistory';
import { BaseTiamatChangeHistoryItem } from '../Types';
import { sortBySortingInfo } from './sortTiamatChangeHistoryItems';

export const noopGetUserNameById: GetUserNameById = () => null;

export function historyItemIsDateRange({
  from,
  to,
}: ChangeHistoryFilters): (item: BaseTiamatChangeHistoryItem) => boolean {
  return (item) =>
    !!item.changed &&
    isDateInRange(parseDateTime(item.changed).toPlainDate(), from, to);
}

export function useSortTiamatHistoryItems<
  T extends BaseTiamatChangeHistoryItem,
>(
  historyItems: ReadonlyArray<T>,
  filters: ChangeHistoryFilters,
  sortingInfo: ChangeHistorySortingInfo,
  getUserNameByIdRealImpl: GetUserNameById,
  getFilterFn: (
    filters: ChangeHistoryFilters,
  ) => (item: T) => boolean = historyItemIsDateRange,
): ReadonlyArray<T> {
  const collator = useCollator({ numeric: true });

  // Most sorting setups do not need to access the mapped username.
  // Thus, we do not need to react to changes in them.
  const getUserNameById: GetUserNameById =
    sortingInfo.sortBy === SortChangeHistoryBy.ChangedBy
      ? getUserNameByIdRealImpl
      : noopGetUserNameById;

  return useMemo(
    () =>
      historyItems
        .filter(getFilterFn(filters))
        .sort(sortBySortingInfo(sortingInfo, collator, getUserNameById)),
    [
      historyItems,
      filters,
      sortingInfo,
      collator,
      getUserNameById,
      getFilterFn,
    ],
  );
}
