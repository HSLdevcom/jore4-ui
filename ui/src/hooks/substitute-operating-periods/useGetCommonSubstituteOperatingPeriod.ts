import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '@/generated/graphql';
import { getSubstituteOperatingPeriodsFilterAndMapper } from '@/hooks/substitute-operating-periods/getSubstituteOperatingPeriodsQueryUtil';
import { QueryParameterName, useDateQueryParam } from '@/hooks/urlQuery';
import { buildIsPresetSubstituteOperatingPeriodFilter } from '@/utils/gql';

export type CommonSubstituteOperatingPeriodsData = {
  isLoadingCommonSubstituteOperatingPeriods: boolean;
  commonSubstituteOperatingPeriods: TimetablesServiceCalendarSubstituteOperatingPeriod[];
  refetchCommonSubstituteOperatingPeriods: () => void;
};

const usePrepareGetCommonSubstituteOperatingPeriods = ({
  startDate: originalStartDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const { mapSubstituteOperatingPeriodsResult, periodDateRangeFilter } =
    getSubstituteOperatingPeriodsFilterAndMapper(originalStartDate, endDate);

  const commonPeriodFilter = {
    ...periodDateRangeFilter,
    ...buildIsPresetSubstituteOperatingPeriodFilter(true),
  };

  const query = useGetSubstituteOperatingPeriodsQuery({
    variables: { periodFilters: commonPeriodFilter },
  });

  const getCommonSubstituteOperatingPeriodData =
    (): CommonSubstituteOperatingPeriodsData => {
      const commonSubstituteOperatingPeriods =
        mapSubstituteOperatingPeriodsResult(query.data);

      return {
        isLoadingCommonSubstituteOperatingPeriods: query.loading,
        refetchCommonSubstituteOperatingPeriods: query.refetch,
        commonSubstituteOperatingPeriods,
      };
    };

  return {
    getCommonSubstituteOperatingPeriodData,
  };
};

export const useGetCommonSubstituteOperatingPeriods = () => {
  const { date: startDate } = useDateQueryParam({
    queryParamName: QueryParameterName.StartDate,
    initialize: false,
  });

  const { date: endDate } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
    initialize: false,
  });

  const { getCommonSubstituteOperatingPeriodData: data } =
    usePrepareGetCommonSubstituteOperatingPeriods({
      startDate,
      endDate,
    });

  const commonSubstituteOperatingPeriodData = useMemo(() => {
    return data();
  }, [data]);

  return { commonSubstituteOperatingPeriodData };
};
