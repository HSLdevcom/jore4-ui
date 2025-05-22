import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useDeleteQuayMutation } from '../../../../generated/graphql';

const GQL_DELETE_QUAY_MUTATION = gql`
  mutation DeleteQuay($stopPlaceId: String!, $quayId: String!) {
    stop_registry {
      deleteQuay(stopPlaceId: $stopPlaceId, quayId: $quayId) {
        id
        version
        ... on stop_registry_StopPlace {
          quays {
            id
            version
          }
        }
      }
    }
  }
`;

export function useDeleteQuay() {
  const [deleteQuay] = useDeleteQuayMutation();

  return useCallback(
    (stopPlaceId: string, quayId: string) =>
      deleteQuay({
        variables: { stopPlaceId, quayId },
        refetchQueries: ['GetMapStops', 'getStopPlaceDetails'],
        awaitRefetchQueries: true,
      }),
    [deleteQuay],
  );
}
