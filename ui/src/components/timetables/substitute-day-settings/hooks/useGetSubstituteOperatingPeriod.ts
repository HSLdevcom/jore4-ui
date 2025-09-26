import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  GetSubstituteOperatingPeriodsQueryVariables,
  useGetSubstituteOperatingPeriodsQuery,
} from '../../../../generated/graphql';

const GQL_GET_SUBSTITUTE_OPERATING_PERIODS = gql`
  query GetSubstituteOperatingPeriods(
    $startDate: date!
    $endDate: date!
    $isPreset: Boolean!
  ) {
    timetables {
      timetables_service_calendar_substitute_operating_period(
        where: {
          substitute_operating_day_by_line_types: {
            _and: [
              { superseded_date: { _gte: $startDate } }
              { superseded_date: { _lte: $endDate } }
            ]
          }
          is_preset: { _eq: $isPreset }
        }
      ) {
        ...SubstituteOperatingPeriodSettingsInfo
      }
    }
  }

  fragment SubstituteOperatingPeriodSettingsInfo on timetables_service_calendar_substitute_operating_period {
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
`;

type DateRange = {
  readonly startDate: DateTime;
  readonly endDate: DateTime;
};

function useGetSubstituteOperatingPeriods(
  variables: GetSubstituteOperatingPeriodsQueryVariables,
) {
  const { data, ...rest } = useGetSubstituteOperatingPeriodsQuery({
    variables,
  });

  const substitutePeriods = useMemo(
    () =>
      compact(
        data?.timetables
          ?.timetables_service_calendar_substitute_operating_period,
      ),
    [data],
  );

  return { ...rest, substitutePeriods };
}

export function useGetCommonSubstituteOperatingPeriods(dateRange: DateRange) {
  return useGetSubstituteOperatingPeriods({ ...dateRange, isPreset: true });
}

export function useGetOccasionalSubstituteOperatingPeriods(
  dateRange: DateRange,
) {
  return useGetSubstituteOperatingPeriods({ ...dateRange, isPreset: false });
}
