import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTimeLike, parseDateTime } from '../../../time/dateTime';
import { SortOrder } from '../../../types';
import { trStatus } from './trStatus';
import { VersionTableSortingInfo } from './useVersionContainerControls';
import { VersionStatus } from './VersionStatus';

type VersionWithSortableFields = {
  readonly status: VersionStatus;
  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;
  readonly version_comment: string;
  readonly changed: DateTimeLike | null;
  readonly changedByUserName: string | null;
};

function compareNullable<T>(
  dateA: T | null,
  dateB: T | null,
  compare: (a: T, b: T) => number,
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

  return compare(dateA, dateB);
}

function compareDates(a: DateTime, b: DateTime) {
  return a.valueOf() - b.valueOf();
}

// Route version has ZonedDateTime, stop version has string
function ensureDateTime(
  value: DateTimeLike | null,
): Temporal.ZonedDateTime | null {
  return parseDateTime(value) ?? null;
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
          return compareNullable(
            a.validity_start,
            b.validity_start,
            compareDates,
          );
        case 'VALIDITY_END':
          return compareNullable(
            a.validity_end,
            b.validity_end,
            compareDates,
            true,
          );
        case 'VERSION_COMMENT':
          return collator.compare(a.version_comment, b.version_comment);
        case 'CHANGED':
          return compareNullable(
            ensureDateTime(a.changed),
            ensureDateTime(b.changed),
            Temporal.ZonedDateTime.compare,
          );
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
