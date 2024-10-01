import { DateTime } from 'luxon';
import { SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS } from '@/components/timetables/substitute-day-settings/common_substitute_day_defaults';
import {
  GetSubstituteOperatingPeriodsQuery,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '@/generated/graphql';
import {
  buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods,
  buildIsPresetSubstituteOperatingPeriodFilter,
} from '@/utils';



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
  let startDate = originalStartDate;

  if (startDate && endDate) {
    const timeDiff = endDate.diff(startDate);
    if (timeDiff.as('year') > SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS) {
      startDate = endDate.minus({
        year: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
      });
    }
  }
  const mapSubstituteOperatingPeriodsResult = (
    result?: GetSubstituteOperatingPeriodsQuery,
  ) => {
    return result?.timetables
      ?.timetables_service_calendar_substitute_operating_period as TimetablesServiceCalendarSubstituteOperatingPeriod[];
  };
  const periodDateRangeFilter = {
    ...buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods(
      startDate,
      endDate,
    ),
  };

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
