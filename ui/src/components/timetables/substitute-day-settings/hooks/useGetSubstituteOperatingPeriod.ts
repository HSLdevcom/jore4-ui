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

function useGetSubstituteOperatingPeriods({
  startDate,
  endDate,
  isPreset,
}: GetSubstituteOperatingPeriodsQueryVariables) {
  const { data, ...rest } = useGetSubstituteOperatingPeriodsQuery({
    variables: {
      isPreset,

      // Hack to fix Luxon.DateTime⋄Apollo cache interaction.
      // Same problem exists everywhere where raw DateTime is used to represent
      // a Postgres `date` type in a query variable. But this is the only
      // one that is currently actively triggering a race condition in E2E tests.

      // Simple description of the problem: Initially Apollo.useQuery tries
      // to refetch the potentially previously fetched data from its cache
      // serialising the variables into a cache key. This process eventually
      // calls DateTime.prototype.toJSON() to serialize the date+time into full
      // ISO 8601 date-time string. But after the actual query is made and
      // dispatched into the Apollo Link-chain, the DateTime's get serialised
      // into date only ISO 8601 string by calling `DateTime.prototype.toISODate()`
      // as per apollo-link-scalars config.
      // Thus, the 'read-data' and 'write-data' cache keys do not match, and
      // sometimes, under yet fully understood conditions, wrong/stale data can
      // get written in the cache as Apollo can't match the request to the network
      // response.

      // Fix: Manually perform the date serializations before handing the variables
      // to Apollo at all. Casts are needed to mask as the GraphQL type generator
      // has been configured not to accept string as input for the PostgeSQL
      // `date` type.
      startDate: startDate.toISODate() as unknown as DateTime,
      endDate: endDate.toISODate() as unknown as DateTime,
    },
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
