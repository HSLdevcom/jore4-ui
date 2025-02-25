import { gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  ServicePatternScheduledStopPoint,
  useGetStopPointForMapStopLazyQuery,
} from '../../../generated/graphql';

const GQL_GET_STOP_POINT_FOR_MAP_STOP = gql`
  query GetStopPointForMapStop($stopNetexId: String!) {
    stopPoint: service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $stopNetexId } }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;

export function useGetStopPointForMapStop() {
  const [getStopPointForMapStop] = useGetStopPointForMapStopLazyQuery();
  return useCallback(
    (stopNetexId: string) =>
      getStopPointForMapStop({ variables: { stopNetexId } }).then(
        (result) =>
          (result.data?.stopPoint.at(0) as ServicePatternScheduledStopPoint) ??
          null,
      ),
    [getStopPointForMapStop],
  );
}
