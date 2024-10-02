import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
} from '@/components/timetables/substitute-day-settings/common_substitute_day_defaults';
import {
  GetSubstituteOperatingPeriodsQuery,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
} from '@/generated/graphql';
import { buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods } from '@/utils';

export const GQL_GET_SUBSTITUTE_OPERATING_PERIODS = gql`
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
export const getSubstituteOperatingPeriodsFilterAndMapper = (originalStartDate: DateTime, endDate: DateTime) => {
  function getStartDateOrMindValue() {
    let startDate = originalStartDate;

    if (startDate && endDate) {
      const timeDiff = endDate.diff(startDate);
      if (timeDiff.as('year') > SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS) {
        startDate = endDate.minus({
          year: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
        });
      }
    }
    return startDate;
  }

  const startDate = getStartDateOrMindValue();
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
  return { mapSubstituteOperatingPeriodsResult, periodDateRangeFilter };
};
