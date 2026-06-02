import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseDate } from '../../../time';
import { SortOrder } from '../../../types';
import { trStatus } from './trStatus';
import { VersionTableSortingInfo } from './useVersionContainerControls';
import { VersionStatus } from './VersionStatus';

type VersionWithSortableFields = {
  readonly status: VersionStatus;
  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;
  readonly version_comment: string;
  readonly changed: string;
  readonly changedByUserName: string | null;
};

function compareDates(
  dateA: DateTime | null,
  dateB: DateTime | null,
  nullsLast = false,
): number {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return nullsLast ? 1 : -1;
  }

  if (dateB === null) {
    return nullsLast ? -1 : 1;
  }

  return dateA.valueOf() - dateB.valueOf();
}

export function useSortedVersions<TVersion extends VersionWithSortableFields>(
  sortingInfo: VersionTableSortingInfo,
  versions: ReadonlyArray<TVersion>,
): ReadonlyArray<TVersion> {
  const { t } = useTranslation();

  const collator = useMemo(
    () => new Intl.Collator(t(($) => $.languages.intlLangCode)),
    [t],
  );

  return useMemo(() => {
    const compare = (a: TVersion, b: TVersion): number => {
      switch (sortingInfo.sortBy) {
        case 'STATUS':
          return collator.compare(trStatus(t, a.status), trStatus(t, b.status));
        case 'VALIDITY_START':
          return compareDates(a.validity_start, b.validity_start);
        case 'VALIDITY_END':
          return compareDates(a.validity_end, b.validity_end, true);
        case 'VERSION_COMMENT':
          return collator.compare(a.version_comment, b.version_comment);
        case 'CHANGED':
          return compareDates(parseDate(a.changed), parseDate(b.changed));
        case 'CHANGED_BY':
          return collator.compare(
            a.changedByUserName ?? '',
            b.changedByUserName ?? '',
          );
        default:
          return 0;
      }
    };

    const orderedCompare =
      sortingInfo.sortOrder === SortOrder.ASCENDING
        ? compare
        : (a: TVersion, b: TVersion) => -compare(a, b);

    return versions.toSorted(orderedCompare);
  }, [sortingInfo, collator, t, versions]);
}
