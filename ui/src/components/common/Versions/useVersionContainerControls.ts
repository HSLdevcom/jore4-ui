import { DateTime } from 'luxon';
import { useState } from 'react';
import { DateRange, SortOrder } from '../../../types';
import { VersionTableColumn } from './VersionTableColumn';

export type VersionTableSortingInfo = {
  readonly sortBy: VersionTableColumn;
  readonly sortOrder: SortOrder;
};

export function useVersionContainerControls() {
  const [expanded, setExpanded] = useState<boolean>(true);

  const [dateRange, setDateRange] = useState<DateRange>(() => ({
    startDate: DateTime.now().minus({ month: 1 }).startOf('month'),
    endDate: DateTime.now().plus({ months: 12 }).endOf('month'),
  }));

  const [sortingInfo, setSortingInfo] = useState<VersionTableSortingInfo>({
    sortBy: 'VALIDITY_START',
    sortOrder: SortOrder.ASCENDING,
  });

  return {
    expanded,
    setExpanded,
    dateRange,
    setDateRange,
    setSortingInfo,
    sortingInfo,
  };
}
