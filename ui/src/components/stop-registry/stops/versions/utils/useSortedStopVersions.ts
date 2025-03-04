import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SortOrder } from '../../../../../types';
import {
  StopVersion,
  StopVersionTableColumn,
  StopVersionTableSortingInfo,
} from '../types';
import { trStatus } from './trStatus';

type Comparator = (versionA: StopVersion, versionB: StopVersion) => number;

function compareDates(dateA: DateTime | null, dateB: DateTime | null): number {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return -1;
  }

  if (dateB === null) {
    return 1;
  }

  return dateA.valueOf() - dateB.valueOf();
}

function useComparator(orderBy: StopVersionTableColumn): Comparator {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const collator = useMemo(() => new Intl.Collator(language), [language]);

  switch (orderBy) {
    case 'STATUS':
      return (a, b) =>
        collator.compare(trStatus(t, a.status), trStatus(t, b.status));

    case 'VALIDITY_START':
      return (a, b) => compareDates(a.validity_start, b.validity_start);

    case 'VALIDITY_END':
      return (a, b) => compareDates(a.validity_end, b.validity_end);

    case 'VERSION_COMMENT':
      return (a, b) => collator.compare(a.version_comment, b.version_comment);

    case 'CHANGED':
      return (a, b) => compareDates(a.changed, b.changed);

    case 'CHANGED_BY':
      return (a, b) => collator.compare(a.changed_by, b.changed_by);

    default:
      return () => 0;
  }
}

export function useSortedStopVersions(
  sortingInfo: StopVersionTableSortingInfo,
  stopVersions: ReadonlyArray<StopVersion>,
): ReadonlyArray<StopVersion> {
  const comparator = useComparator(sortingInfo.sortBy);

  return useMemo(() => {
    const orderedComparator: Comparator =
      sortingInfo.sortOrder === SortOrder.ASCENDING
        ? comparator
        : (a, b) => -comparator(a, b);

    return stopVersions.toSorted(orderedComparator);
  }, [sortingInfo, comparator, stopVersions]);
}
