import { gql } from '@apollo/client';
import { useGetUniqueLineCountForStopOnDateQuery } from '../../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../../hooks';

const GQL_GET_UNIQUE_LINE_COUNT_FOR_STOP_ON_DATE = gql`
  query GetUniqueLineCountForStopOnDate($stopPointId: uuid!, $date: date!) {
    route_line_aggregate(
      where: {
        validity_start: { _lte: $date }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
        line_routes: {
          # Only count lines that have active routes using the stop point
          validity_start: { _lte: $date }
          _or: [
            { validity_end: { _gte: $date } }
            { validity_end: { _is_null: true } }
          ]
          route_journey_patterns: {
            scheduled_stop_point_in_journey_patterns: {
              scheduled_stop_points: {
                scheduled_stop_point_id: { _eq: $stopPointId }
              }
            }
          }
        }
      }
      distinct_on: [label]
    ) {
      aggregate {
        count
      }
    }
  }
`;

type LinesForScheduledStopPointOnDateResult =
  | {
      readonly lineCount: number | null;
      readonly loading: false;
    }
  | {
      readonly lineCount: null;
      readonly loading: true;
    };

export const useGetUniqueLineCountForStopOnDate = (
  scheduledStopPointId?: UUID,
): LinesForScheduledStopPointOnDateResult => {
  const { observationDate } = useObservationDateQueryParam();
  const { data, loading } = useGetUniqueLineCountForStopOnDateQuery(
    scheduledStopPointId
      ? {
          variables: {
            stopPointId: scheduledStopPointId,
            date: observationDate,
          },
        }
      : { skip: true },
  );

  if (loading) {
    return { loading: true, lineCount: null };
  }

  const lineCount = data?.route_line_aggregate.aggregate?.count;

  if (!scheduledStopPointId || lineCount === undefined) {
    return { lineCount: null, loading: false };
  }

  return {
    lineCount,
    loading: false,
  };
};
