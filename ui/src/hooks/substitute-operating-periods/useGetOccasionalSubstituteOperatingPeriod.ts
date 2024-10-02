import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '@/generated/graphql';
import { getSubstituteOperatingPeriodsFilterAndMapper } from '@/hooks/substitute-operating-periods/getSubstituteOperatingPeriodsQueryUtil';
import { QueryParameterName, useDateQueryParam } from '@/hooks/urlQuery';
import { buildIsPresetSubstituteOperatingPeriodFilter } from '@/utils/gql';

export type OccasionalSubstituteOperatingPeriodsData = {
  isLoadingOccasionalSubstituteOperatingPeriods: boolean;
  occasionalSubstituteOperatingPeriods: TimetablesServiceCalendarSubstituteOperatingPeriod[];
  refetchOccasionalSubstituteOperatingPeriods: () => void;
};

const usePrepareGetOccasionalSubstituteOperatingPeriods = ({
  startDate: originalStartDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const { mapSubstituteOperatingPeriodsResult, periodDateRangeFilter } =
    getSubstituteOperatingPeriodsFilterAndMapper(originalStartDate, endDate);

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

export const useGetOccasionalSubstituteOperatingPeriods = () => {
  const { date: startDate } = useDateQueryParam({
    queryParamName: QueryParameterName.StartDate,
    initialize: false,
  });

  const { date: endDate } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
    initialize: false,
  });

  const { getOccasionalSubstituteOperatingPeriodData: data } =
    usePrepareGetOccasionalSubstituteOperatingPeriods({
      startDate,
      endDate,
    });

  const occasionalSubstituteOperatingPeriodData = useMemo(() => {
    return data();
  }, [data]);

  return { occasionalSubstituteOperatingPeriodData };
};
