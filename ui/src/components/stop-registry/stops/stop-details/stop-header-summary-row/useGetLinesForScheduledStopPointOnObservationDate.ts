import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniqBy from 'lodash/uniqBy';
import {
  LineAllFieldsFragment,
  useGetLinesForScheduledStopPointOnDateQuery,
} from '../../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../../hooks';

const GQL_GET_LINES_FOR_SCHEDULED_STOP_POINT_ON_DATE = gql`
  query GetLinesForScheduledStopPointOnDate($stopPointId: uuid!, $date: date!) {
    service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stopPointId } }
    ) {
      label
      scheduled_stop_point_id
      scheduled_stop_point_in_journey_patterns(
        where: {
          journey_pattern: {
            journey_pattern_route: {
              validity_start: { _lte: $date }
              _or: [
                { validity_end: { _gte: $date } }
                { validity_end: { _is_null: true } }
              ]
            }
          }
        }
      ) {
        journey_pattern_id
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern {
          journey_pattern_id
          journey_pattern_route {
            ...route_default_fields
            route_line {
              ...line_all_fields
            }
          }
        }
      }
    }
  }
`;

type LinesForScheduledStopPointOnDateResult =
  | {
      readonly lines: ReadonlyArray<LineAllFieldsFragment> | null;
      readonly loading: false;
    }
  | {
      readonly lines: null;
      readonly loading: true;
    };

export const useGetLinesForScheduledStopPointOnObservationDate = (
  scheduledStopPointId?: UUID,
): LinesForScheduledStopPointOnDateResult => {
  const { observationDate } = useObservationDateQueryParam();
  const { data, loading } = useGetLinesForScheduledStopPointOnDateQuery({
    skip: !scheduledStopPointId,
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stopPointId: scheduledStopPointId!,
      date: observationDate,
    },
  });

  if (loading) {
    return { loading: true, lines: null };
  }

  if (!scheduledStopPointId) {
    return { lines: null, loading: false };
  }

  const stopPointAllLines = compact(
    data?.service_pattern_scheduled_stop_point.flatMap((sp) =>
      sp.scheduled_stop_point_in_journey_patterns
        .map((jp) => jp.journey_pattern.journey_pattern_route)
        .map((route) => route?.route_line),
    ),
  );

  return {
    lines: uniqBy(stopPointAllLines, (line) => line.line_id),
    loading: false,
  };
};
