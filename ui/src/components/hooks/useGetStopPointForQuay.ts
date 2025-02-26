import { gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  ServicePatternScheduledStopPoint,
  useGetStopPointForQuayLazyQuery,
} from '../../generated/graphql';
import { useLoader } from '../../hooks';
import { LoadingState, Operation } from '../../redux';

const GQL_GET_STOP_POINT_FOR_QUAY = gql`
  query GetStopPointForQuay($quayNetexId: String!) {
    stopPoint: service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $quayNetexId } }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;

export function useGetStopPointForQuay() {
  const [getStopPointForQuay] = useGetStopPointForQuayLazyQuery();
  const { setLoadingState } = useLoader(Operation.ResolveScheduledStopPoint);

  return useCallback(
    async (quayNetexId: string) => {
      try {
        setLoadingState(LoadingState.MediumPriority);

        const result = await getStopPointForQuay({
          variables: { quayNetexId },
        });
        const stopPoint =
          (result.data?.stopPoint.at(0) as ServicePatternScheduledStopPoint) ??
          null;

        if (!stopPoint) {
          throw new Error(
            `No scheduled stop found with Quay Netex ID (${quayNetexId})`,
          );
        }

        return stopPoint;
      } finally {
        setLoadingState(LoadingState.NotLoading);
      }
    },
    [setLoadingState, getStopPointForQuay],
  );
}
