import { QueryResult } from '@apollo/client';
import { useEffect } from 'react';
import { Operation, useLoader } from '../../../redux';
import { LoadingState } from '../../../types';

export function useMapDataLayerLoader(
  operation: Operation,
  initialLoadDone: boolean,
  loading: boolean,
) {
  const { setLoadingState } = useLoader(operation);

  useEffect(() => {
    if (!initialLoadDone) {
      setLoadingState(LoadingState.HighPriority);
    } else {
      setLoadingState(
        loading ? LoadingState.LowPriority : LoadingState.NotLoading,
      );
    }
  }, [loading, initialLoadDone, setLoadingState]);

  return setLoadingState;
}

export function useMapDataLayerSimpleQueryLoader<T>(
  operation: Operation,
  { data, loading, previousData }: QueryResult<T>,
  skipped = false,
) {
  const initialLoadDone = !!(previousData ?? data) || skipped;
  return useMapDataLayerLoader(operation, initialLoadDone, loading && !skipped);
}
