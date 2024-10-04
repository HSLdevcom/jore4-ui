import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  GetSubstituteOperatingPeriodsQuery,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
} from '@/generated/graphql';
import {
  DateControlValidator,
  DateValidatorSource,
} from '@/utils/date-control-validator';
import { buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods } from '@/utils/gql';

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
export const getSubstituteOperatingPeriodsFilterAndMapper = (
  originalStartDate: DateTime,
  endDate: DateTime,
) => {
  const { replacedDate } = DateControlValidator.validatorFor(
    DateValidatorSource.SubstitutePeriodStartDay,
  ).validate({ startDate: originalStartDate, endDate });

  const startDate = replacedDate ?? originalStartDate;

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

export const validateAndReplaceStartDate = (
  startDate: DateTime,
  endDate: DateTime,
) => {
  const { replacedDate } = DateControlValidator.validatorFor(
    DateValidatorSource.SubstitutePeriodStartDay,
  ).validate({ startDate, endDate });

  return replacedDate ?? startDate;
};
