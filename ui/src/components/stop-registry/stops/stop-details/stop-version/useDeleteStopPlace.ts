import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useDeleteStopPlaceMutation } from '../../../../../generated/graphql';

const GQL_DELETE_STOP_PLACE = gql`
  mutation DeleteStopPlace($stopPlaceId: String!) {
    stop_registry {
      deleteStopPlace(stopPlaceId: $stopPlaceId)
    }
  }
`;

export function useDeleteStopPlace() {
  const [deleteStopPlaceMutation] = useDeleteStopPlaceMutation();

  return useCallback(
    (stopPlaceId: string): Promise<boolean> =>
      deleteStopPlaceMutation({ variables: { stopPlaceId } }).then(
        (result) => !!result.data?.stop_registry?.deleteStopPlace,
      ),
    [deleteStopPlaceMutation],
  );
}
