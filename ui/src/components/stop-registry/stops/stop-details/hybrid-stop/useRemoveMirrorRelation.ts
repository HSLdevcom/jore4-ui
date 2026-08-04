import { gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useRemoveStopPointsByQuayRefMutation } from '../../../../../generated/graphql';
import { useDeleteQuay } from '../../queries/useDeleteQuay';

const GQL_REMOVE_STOP = gql`
  mutation RemoveStopPointsByQuayRef($ref: String!) {
    delete_service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $ref } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;

type RemoveMirrorRelationParams = {
  readonly childQuayId: string;
  readonly childStopPlaceId: string;
};

export function useRemoveMirrorRelation() {
  const [loading, setLoading] = useState(false);

  const [removeStopPoints] = useRemoveStopPointsByQuayRefMutation();
  const deleteQuay = useDeleteQuay();

  const removeMirrorRelation = useCallback(
    async ({ childQuayId, childStopPlaceId }: RemoveMirrorRelationParams) => {
      setLoading(true);
      try {
        // 1. Remove the child's SSP (scheduled stop point)
        await removeStopPoints({ variables: { ref: childQuayId } });

        // 2. Delete the child quay from Tiamat
        await deleteQuay(childStopPlaceId, childQuayId);

        return true;
      } finally {
        setLoading(false);
      }
    },
    [removeStopPoints, deleteQuay],
  );

  return { removeMirrorRelation, loading };
}
