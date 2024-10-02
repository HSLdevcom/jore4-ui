import { DateTime } from 'luxon';
import {
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '@/generated/graphql';
import {
  getSubstituteOperatingPeriodsFilterAndMapper,
} from '@/hooks/substitute-operating-periods/getSubstituteOperatingPeriodsQueryUtil';
import { buildIsPresetSubstituteOperatingPeriodFilter } from '@/utils';


export type OccasionalSubstituteOperatingPeriodsData = {
  isLoadingOccasionalSubstituteOperatingPeriods: boolean;
  occasionalSubstituteOperatingPeriods: TimetablesServiceCalendarSubstituteOperatingPeriod[];
  refetchOccasionalSubstituteOperatingPeriods: () => void;
};

export const useGetOccasionalSubstituteOperatingPeriods = ({
  startDate: originalStartDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const { mapSubstituteOperatingPeriodsResult, periodDateRangeFilter } = getSubstituteOperatingPeriodsFilterAndMapper(originalStartDate, endDate);

  const occasionalPeriodFilter = {
    ...periodDateRangeFilter,
    ...buildIsPresetSubstituteOperatingPeriodFilter(false),
  };

  const query = useGetSubstituteOperatingPeriodsQuery({
    variables: { periodFilters: occasionalPeriodFilter },
  });

  const getOccasionalSubstituteOperatingPeriodData =
    (): OccasionalSubstituteOperatingPeriodsData => {
      const occasionalSubstituteOperatingPeriods =
        mapSubstituteOperatingPeriodsResult(query.data);

      return {
        isLoadingOccasionalSubstituteOperatingPeriods: query.loading,
        refetchOccasionalSubstituteOperatingPeriods: query.refetch,
        occasionalSubstituteOperatingPeriods,
      };
    };

  return {
    getOccasionalSubstituteOperatingPeriodData,
  };
};
