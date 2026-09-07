import { gql, useApolloClient } from '@apollo/client';
import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  GetJourneyPatternsOfScheduledStopPointDocument,
  GetJourneyPatternsOfScheduledStopPointQuery,
  GetJourneyPatternsOfScheduledStopPointQueryVariables,
  JourneyPatternFieldsFragment,
  JourneyPatternScheduledStopPointInJourneyPatternBoolExp,
  RouteRouteBoolExp,
} from '../../../../../generated/graphql';

const GQL_GET_JOURNEY_PATTERNS_OF_STOP_POINT_WITH_END_DATE = gql`
  query GetJourneyPatternsOfScheduledStopPoint(
    $where: journey_pattern_scheduled_stop_point_in_journey_pattern_bool_exp!
  ) {
    ssps: journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: $where
    ) {
      ...JourneyPatternStopPoint
    }
  }

  fragment JourneyPatternRouteFields on route_route {
    route_id
    label
    variant
    validity_start
    validity_end
  }

  fragment JourneyPatternFields on journey_pattern_journey_pattern {
    journey_pattern_id
    on_route_id

    journey_pattern_route {
      ...JourneyPatternRouteFields
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
`;

function getWhere(
  label: string,
  startDate: DateTime,
  endDate: DateTime | null,
): JourneyPatternScheduledStopPointInJourneyPatternBoolExp {
  const startDateCondition: RouteRouteBoolExp = {
    _or: [
      { validity_end: { _is_null: true } },
      { validity_end: { _gte: startDate } },
    ],
  };

  const endDateCondition: RouteRouteBoolExp | null = endDate
    ? { validity_start: { _lte: endDate } }
    : null;

  return {
    scheduled_stop_points: { label: { _eq: label } },
    journey_pattern: {
      journey_pattern_route: {
        _and: compact([startDateCondition, endDateCondition]),
      },
    },
  };
}

export function useGetJourneyPatternsOfStopPointDuringTimePeriod() {
  const apollo = useApolloClient();

  return useCallback(
    async (
      label: string,
      startDate: DateTime,
      endDate: DateTime | null,
    ): Promise<JourneyPatternFieldsFragment[]> => {
      const result = await apollo.query<
        GetJourneyPatternsOfScheduledStopPointQuery,
        GetJourneyPatternsOfScheduledStopPointQueryVariables
      >({
        query: GetJourneyPatternsOfScheduledStopPointDocument,
        variables: { where: getWhere(label, startDate, endDate) },
      });

      return compact(result.data.ssps).map((jp) => jp.journey_pattern);
    },
    [apollo],
  );
}
