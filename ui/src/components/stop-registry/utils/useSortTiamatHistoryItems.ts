import { useMemo } from 'react';
import { GetUserNameById } from '../../../hooks';
import { useCollator } from '../../../utils';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../common/ChangeHistory';
import { BaseTiamatChangeHistoryItem } from '../types';
import { filterTiamatHistoryItems } from './filterTiamatHistoryItems';
import { sortBySortingInfo } from './sortTiamatChangeHistoryItems';

const noopGetUserNameById: GetUserNameById = () => null;

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
        .filter(filterTiamatHistoryItems(filters))
        .sort(sortBySortingInfo(sortingInfo, collator, getUserNameById)),
    [historyItems, filters, sortingInfo, collator, getUserNameById],
  );
}
