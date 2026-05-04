import compact from 'lodash/compact';
import { useCallback, useEffect, useState } from 'react';
import { EnrichedQuay } from '../../../../../types';
import { getMirroredByIds } from '../../../../../utils/stop-registry/mirrorRelation';
import {
  MirroredQuayDetails,
  useGetMirroredQuay,
} from '../../queries/useGetMirroredQuay';

type UseGetAllMirroredQuaysResult = {
  readonly mirroredQuays: ReadonlyArray<MirroredQuayDetails>;
  readonly loading: boolean;
};

export function useGetAllMirroredQuays(
  parentQuay: EnrichedQuay | null | undefined,
): UseGetAllMirroredQuaysResult {
  const getMirroredQuay = useGetMirroredQuay();
  const [mirroredQuays, setMirroredQuays] = useState<
    ReadonlyArray<MirroredQuayDetails>
  >([]);
  const [loading, setLoading] = useState(false);

  const childIds = parentQuay ? getMirroredByIds(parentQuay) : [];
  const childIdsKey = childIds.join(',');

  const fetchAll = useCallback(async () => {
    if (!childIdsKey) {
      setMirroredQuays([]);
      return;
    }

    setLoading(true);
    try {
      const ids = childIdsKey.split(',');
      const results = await Promise.all(ids.map(getMirroredQuay));
      setMirroredQuays(compact(results));
    } finally {
      setLoading(false);
    }
  }, [childIdsKey, getMirroredQuay]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { mirroredQuays, loading };
}
