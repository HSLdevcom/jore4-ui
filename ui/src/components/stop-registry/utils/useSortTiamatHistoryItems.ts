import { useMemo } from 'react';
import { GetUserNameById } from '../../../hooks';
import { useCollator } from '../../../utils';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../common/ChangeHistory';
import { BaseTiamatChangeHistoryItem } from '../types';
import { sortBySortingInfo } from './sortTiamatChangeHistoryItems';

export const noopGetUserNameById: GetUserNameById = () => null;

function historyItemIsDateRange({
  from,
  to,
}: ChangeHistoryFilters): (item: BaseTiamatChangeHistoryItem) => boolean {
  const fromStr = from.startOf('day').toUTC().toISO({ includeOffset: false });
  const toStr = to.endOf('day').toUTC().toISO({ includeOffset: false });

  return (item) =>
    // Changed is a ISO 8601 date-time string and be compared as string.
    !!item.changed && fromStr <= item.changed && item.changed <= toStr;
}

export function useSortTiamatHistoryItems<
  T extends BaseTiamatChangeHistoryItem,
>(
  historyItems: ReadonlyArray<T>,
  filters: ChangeHistoryFilters,
  sortingInfo: ChangeHistorySortingInfo,
  getUserNameByIdRealImpl: GetUserNameById,
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
        .filter(historyItemIsDateRange(filters))
        .sort(sortBySortingInfo(sortingInfo, collator, getUserNameById)),
    [historyItems, filters, sortingInfo, collator, getUserNameById],
  );
}
