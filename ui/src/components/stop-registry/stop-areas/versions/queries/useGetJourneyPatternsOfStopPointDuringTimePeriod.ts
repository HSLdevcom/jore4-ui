import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  JourneyPatternFieldsFragment,
  useGetJourneyPatternsOfScheduledStopPointWithEndDateLazyQuery,
  useGetJourneyPatternsOfScheduledStopPointWithNoEndDateLazyQuery,
} from '../../../../../generated/graphql';

const GQL_GET_JOURNEY_PATTERNS_OF_STOP_POINT_WITH_END_DATE = gql`
  query GetJourneyPatternsOfScheduledStopPointWithEndDate(
    $label: String!
    $startDate: date!
    $endDate: date!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_points: { label: { _eq: $label } }
        journey_pattern: {
          journey_pattern_route: {
            validity_start: { _lte: $endDate }
            _or: [
              { validity_end: { _is_null: true } }
              { validity_end: { _gte: $startDate } }
            ]
          }
        }
      }
    ) {
      ...JourneyPatternStopPoint
    }
  }

  fragment JourneyPatternStopPoint on journey_pattern_scheduled_stop_point_in_journey_pattern {
    journey_pattern_id
    scheduled_stop_point_label
    scheduled_stop_point_sequence
    journey_pattern {
      ...JourneyPatternFields
    }
  }

  fragment JourneyPatternFields on journey_pattern_journey_pattern {
    journey_pattern_id
    on_route_id
    journey_pattern_route {
      ...JourneyPatternRouteFields
    }
  }

  fragment JourneyPatternRouteFields on route_route {
    route_id
    label
    variant
    validity_start
    validity_end
  }
`;

const GQL_GET_JOURNEY_PATTERNS_OF_STOP_POINT_WITH_NO_END_DATE = gql`
  query GetJourneyPatternsOfScheduledStopPointWithNoEndDate(
    $label: String!
    $startDate: date!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_points: { label: { _eq: $label } }
        journey_pattern: {
          journey_pattern_route: {
            # We only need to check that the validity period had not already ended
            _or: [
              { validity_end: { _is_null: true } }
              { validity_end: { _gte: $startDate } }
            ]
          }
        }
      }
    ) {
      ...JourneyPatternStopPoint
    }
  }
`;

export const useGetJourneyPatternsOfStopPointDuringTimePeriod = () => {
  const [getJourneyPatternWithEndDate] =
    useGetJourneyPatternsOfScheduledStopPointWithEndDateLazyQuery();
  const [getJourneyPatternWithNoEndDate] =
    useGetJourneyPatternsOfScheduledStopPointWithNoEndDateLazyQuery();

  return useCallback(
    async (
      label: string,
      startDate: DateTime,
      endDate: DateTime | null,
    ): Promise<JourneyPatternFieldsFragment[]> => {
      const result = endDate
        ? await getJourneyPatternWithEndDate({
            variables: {
              label,
              startDate,
              endDate,
            },
          })
        : await getJourneyPatternWithNoEndDate({
            variables: {
              label,
              startDate,
            },
          });

      const journeyPatterns = compact(
        result.data?.journey_pattern_scheduled_stop_point_in_journey_pattern,
      ).map((jp) => jp.journey_pattern);

      return journeyPatterns;
    },
    [getJourneyPatternWithEndDate, getJourneyPatternWithNoEndDate],
  );
};
