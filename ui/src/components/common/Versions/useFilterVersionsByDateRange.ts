import { useMemo } from 'react';
import { areValidityPeriodsOverlapping } from '../../../time/date';
import { DateRange } from '../../../types';

type VersionWithValidity = {
  readonly validity_start: Temporal.PlainDate;
  readonly validity_end: Temporal.PlainDate | null;
};

export function useFilterVersionsByDateRange<T extends VersionWithValidity>(
  versions: ReadonlyArray<T>,
  dateRange: DateRange,
): ReadonlyArray<T> {
  return useMemo(() => {
    const range = {
      validity_start: dateRange.startDate,
      validity_end: dateRange.endDate,
    };

    return versions.filter((version) =>
      areValidityPeriodsOverlapping(version, range),
    );
  }, [versions, dateRange]);
}
