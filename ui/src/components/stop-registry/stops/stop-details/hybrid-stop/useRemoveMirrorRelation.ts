import { useCallback, useState } from 'react';
import {
  useEditKeyValuesOfQuayMutation,
  useGetStopPointsByQuayIdLazyQuery,
  useRemoveStopMutation,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import {
  removeMirroredBy,
  stripKeyValueTypenames,
} from '../../../../../utils/stop-registry/mirrorRelation';
import { useDeleteQuay } from '../../queries/useDeleteQuay';

type RemoveMirrorRelationParams = {
  readonly parentStop: StopWithDetails;
  readonly childQuayId: string;
  readonly childStopPlaceId: string;
};

export function useRemoveMirrorRelation() {
  const [loading, setLoading] = useState(false);

  const [editKeyValuesOfQuay] = useEditKeyValuesOfQuayMutation({
    refetchQueries: ['GetStopDetails'],
    awaitRefetchQueries: true,
  });

  const [getStopPointsByQuayId] = useGetStopPointsByQuayIdLazyQuery();
  const [removeStopMutation] = useRemoveStopMutation();
  const deleteQuay = useDeleteQuay();

  const removeMirrorRelation = useCallback(
    async ({
      parentStop,
      childQuayId,
      childStopPlaceId,
    }: RemoveMirrorRelationParams) => {
      const parentQuayId = parentStop.quay?.id;
      const parentStopPlaceId = parentStop.stop_place?.id;
      if (!parentQuayId || !parentStopPlaceId) {
        return false;
      }

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

        // 3. Remove child from parent's mirroredBy list
        const updatedParentKeyValues = removeMirroredBy(
          parentStop.quay?.keyValues ?? undefined,
          childQuayId,
        );

        await editKeyValuesOfQuay({
          variables: {
            stopId: parentStopPlaceId,
            quayId: parentQuayId,
            keyValues: stripKeyValueTypenames(updatedParentKeyValues),
            versionComment: 'Yhteiskäyttöpysäkin poisto',
          },
        });

        return true;
      } finally {
        setLoading(false);
      }
    },
    [
      editKeyValuesOfQuay,
      getStopPointsByQuayId,
      removeStopMutation,
      deleteQuay,
    ],
  );

  return { removeMirrorRelation, loading };
}
