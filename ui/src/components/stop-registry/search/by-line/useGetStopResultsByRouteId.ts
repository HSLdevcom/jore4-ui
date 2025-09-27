import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  GetStopByRouteIdSearchResultFragment,
  useGetStopsByRouteIdQuery,
} from '../../../../generated/graphql';
import { SortOrder } from '../../../../types';
import { StopSearchRow, mapQueryResultToStopSearchRow } from '../../components';

const GQL_GET_STOPS_BY_ROUTE_ID_QUERY = gql`
  query getStopsByRouteId($routeId: uuid!) {
    stopPoints: service_pattern_scheduled_stop_point(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: { on_route_id: { _eq: $routeId } }
        }
      }
    ) {
      ...GetStopByRouteIdSearchResult
    }
  }

  fragment GetStopByRouteIdSearchResult on service_pattern_scheduled_stop_point {
    ...StopTableRow_ScheduledStopPoint_Details

    quay: newest_quay {
      ...StopTableRow_Quay_Details
    }

    journeyPatterns: scheduled_stop_point_in_journey_patterns(
      where: { journey_pattern: { on_route_id: { _eq: $routeId } } }
    ) {
      journey_pattern_id
      sequence: scheduled_stop_point_sequence
    }
  }
`;

function compareSequenceNumbers(
  a: GetStopByRouteIdSearchResultFragment,
  b: GetStopByRouteIdSearchResultFragment,
): number {
  const aSequenceNumber = a.journeyPatterns?.at(0)?.sequence ?? -1;
  const bSequenceNumber = b.journeyPatterns?.at(0)?.sequence ?? -1;

  return aSequenceNumber - bSequenceNumber;
}

export function useGetStopResultsByRouteId(
  routeId: UUID,
  sortOrder: SortOrder,
) {
  const { data, ...rest } = useGetStopsByRouteIdQuery({
    variables: { routeId },
  });

  const stops: ReadonlyArray<StopSearchRow> = useMemo(() => {
    const mapped = data?.stopPoints
      ?.toSorted(
        sortOrder === SortOrder.ASCENDING
          ? (a, b) => compareSequenceNumbers(a, b)
          : (a, b) => -compareSequenceNumbers(a, b),
      )
      .map((rawStopPoint) =>
        mapQueryResultToStopSearchRow(rawStopPoint.quay, rawStopPoint),
      );

    return compact(mapped);
  }, [data, sortOrder]);

  return { ...rest, stops };
}
