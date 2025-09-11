import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  GetSubstituteOperatingPeriodsQuery,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '../../../../generated/graphql';
import {
  buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods,
  buildIsPresetSubstituteOperatingPeriodFilter,
} from '../../../../utils';

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

const mapSubstituteOperatingPeriodsResult = (
  result?: GetSubstituteOperatingPeriodsQuery,
) => {
  return result?.timetables
    ?.timetables_service_calendar_substitute_operating_period as ReadonlyArray<TimetablesServiceCalendarSubstituteOperatingPeriod>;
};

export const useGetCommonSubstituteOperatingPeriods = ({
  startDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const periodDateRangeFilter = {
    ...buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods(
      startDate,
      endDate,
    ),
  };

  const commonPeriodFilter = {
    ...periodDateRangeFilter,
    ...buildIsPresetSubstituteOperatingPeriodFilter(true),
  };

  const { data, ...rest } = useGetSubstituteOperatingPeriodsQuery({
    variables: { periodFilters: commonPeriodFilter },
  });

  const commonSubstituteOperatingPeriods =
    mapSubstituteOperatingPeriodsResult(data);

  return { ...rest, commonSubstituteOperatingPeriods };
};

export const useGetOccasionalSubstituteOperatingPeriods = ({
  startDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
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

  const { data, ...rest } = useGetSubstituteOperatingPeriodsQuery({
    variables: { periodFilters: occasionalPeriodFilter },
  });

  const occasionalSubstituteOperatingPeriods =
    mapSubstituteOperatingPeriodsResult(data);

  return { ...rest, occasionalSubstituteOperatingPeriods };
};
