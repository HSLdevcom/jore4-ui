import { useCallback, useState } from 'react';
import {
  useGetStopPointsByQuayIdLazyQuery,
  useRemoveStopMutation,
} from '../../../../../generated/graphql';
import { useDeleteQuay } from '../../queries/useDeleteQuay';

type RemoveMirrorRelationParams = {
  readonly childQuayId: string;
  readonly childStopPlaceId: string;
};

export function useRemoveMirrorRelation() {
  const [loading, setLoading] = useState(false);

  const [getStopPointsByQuayId] = useGetStopPointsByQuayIdLazyQuery();
  const [removeStopMutation] = useRemoveStopMutation();
  const deleteQuay = useDeleteQuay();

  const removeMirrorRelation = useCallback(
    async ({ childQuayId, childStopPlaceId }: RemoveMirrorRelationParams) => {
      setLoading(true);
      try {
        // 1. Remove the child's SSP (scheduled stop point)
        const sspResult = await getStopPointsByQuayId({
          variables: { quayIds: [childQuayId] },
        });
        const childStopPoints =
          sspResult.data?.service_pattern_scheduled_stop_point ?? [];
        await Promise.all(
          childStopPoints.map((ssp) =>
            removeStopMutation({
              variables: { stop_id: ssp.scheduled_stop_point_id },
            }),
          ),
        );

        // 2. Delete the child quay from Tiamat
        await deleteQuay(childStopPlaceId, childQuayId);

        return true;
      } finally {
        setLoading(false);
      }
    },
    [getStopPointsByQuayId, removeStopMutation, deleteQuay],
  );

  return { removeMirrorRelation, loading };
}
