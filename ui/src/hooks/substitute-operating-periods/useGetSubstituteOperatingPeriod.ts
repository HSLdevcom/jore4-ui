import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  GetSubstituteOperatingPeriodsQuery,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '../../generated/graphql';
import {
  buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods,
  buildIsPresetSubstituteOperatingPeriodFilter,
} from '../../utils';

const GQL_GET_SUBSTITUTE_OPERATING_PERIODS = gql`
  query GetSubstituteOperatingPeriods(
    $periodFilters: timetables_service_calendar_substitute_operating_period_bool_exp
  ) {
    timetables {
      timetables_service_calendar_substitute_operating_period(
        where: $periodFilters
      ) {
        period_name
        is_preset
        substitute_operating_period_id
        substitute_operating_day_by_line_types {
          begin_time
          end_time
          substitute_day_of_week
          substitute_operating_day_by_line_type_id
          superseded_date
          type_of_line
        }
      }
    }
  }
`;

export const useGetSubstituteOperatingPeriods = ({
  startDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
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
  const commonPeriodFilter = {
    ...periodDateRangeFilter,
    ...buildIsPresetSubstituteOperatingPeriodFilter(true),
  };

  const {
    data: occasionalSubstituteOperatingPeriodData,
    refetch: refetchOccasionalSubstituteOperatingPeriods,
    loading: isLoadingOccasionalSubstituteOperatingPeriods,
  } = useGetSubstituteOperatingPeriodsQuery({
    variables: { periodFilters: occasionalPeriodFilter },
  });

  const {
    data: commonSubstituteOperatingPeriodData,
    refetch: refetchCommonSubstituteOperatingPeriods,
  } = useGetSubstituteOperatingPeriodsQuery({
    variables: { periodFilters: commonPeriodFilter },
  });

  const occasionalSubstituteOperatingPeriods =
    mapSubstituteOperatingPeriodsResult(
      occasionalSubstituteOperatingPeriodData,
    );

  const commonSubstituteOperatingPeriods = mapSubstituteOperatingPeriodsResult(
    commonSubstituteOperatingPeriodData,
  );

  return {
    refetchOccasionalSubstituteOperatingPeriods,
    isLoadingOccasionalSubstituteOperatingPeriods,
    refetchCommonSubstituteOperatingPeriods,
    occasionalSubstituteOperatingPeriods,
    commonSubstituteOperatingPeriods,
  };
};
