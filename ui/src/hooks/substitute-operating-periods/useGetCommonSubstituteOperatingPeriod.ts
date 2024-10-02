import { DateTime } from 'luxon';
import {
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '@/generated/graphql';
import {
  getSubstituteOperatingPeriodsFilterAndMapper,
} from '@/hooks/substitute-operating-periods/getSubstituteOperatingPeriodsQueryUtil';
import { buildIsPresetSubstituteOperatingPeriodFilter } from '@/utils';


export type CommonSubstituteOperatingPeriodsData = {
  isLoadingCommonSubstituteOperatingPeriods: boolean;
  commonSubstituteOperatingPeriods: TimetablesServiceCalendarSubstituteOperatingPeriod[];
  refetchCommonSubstituteOperatingPeriods: () => void;
};


export const useGetCommonSubstituteOperatingPeriods = ({
  startDate: originalStartDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const { mapSubstituteOperatingPeriodsResult, periodDateRangeFilter } = getSubstituteOperatingPeriodsFilterAndMapper(originalStartDate, endDate);

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
