import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { DateRange } from '../../../types';

type VersionWithValidity = {
  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;
};

export function useFilterVersionsByDateRange<T extends VersionWithValidity>(
  versions: ReadonlyArray<T>,
  dateRange: DateRange,
): ReadonlyArray<T> {
  const from = dateRange.startDate.valueOf();
  const to = dateRange.endDate.valueOf();

  return useMemo(() => {
    return versions.filter((version) => {
      const versionFrom = version.validity_start.valueOf();
      const versionTo =
        version.validity_end?.valueOf() ?? Number.POSITIVE_INFINITY;

      return !(
        // End before range start
        (versionTo < from || versionFrom > to) // Starts after range end
      );
    });
  }, [versions, from, to]);
}
