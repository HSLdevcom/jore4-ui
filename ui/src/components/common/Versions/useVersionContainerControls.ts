import { useState } from 'react';
import { today } from '../../../time/date';
import { DateRange, SortOrder } from '../../../types';
import { VersionTableColumn } from './VersionTableColumn';

export type VersionTableSortingInfo = {
  readonly sortBy: VersionTableColumn;
  readonly sortOrder: SortOrder;
};

export function useVersionContainerControls() {
  const [expanded, setExpanded] = useState<boolean>(true);

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const startDate = today().subtract({ months: 1 }).with({ day: 1 });
    const endDate = today().add({ months: 12 }).with({ day: 31 });

    return { startDate, endDate };
  });

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
