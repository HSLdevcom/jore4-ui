import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MapData } from '../../components/map/useMapData';
import {
  LoadingState,
  Operation,
  setLoadingAction,
  setLoadingStateAction,
} from '../../redux';

interface LoaderOptions {
  initialState?: LoadingState;
}

export function useLoader(operation: Operation, options?: LoaderOptions) {
  const dispatch = useDispatch();

  const setIsLoading = useCallback(
    (isLoading: boolean) =>
      dispatch(setLoadingAction({ operation, isLoading })),
    [dispatch, operation],
  );

  const setLoadingState = useCallback(
    (state: LoadingState) =>
      dispatch(setLoadingStateAction({ operation, state })),
    [dispatch, operation],
  );

  useEffect(() => {
    const initialState = options?.initialState;

    if (initialState) {
      setLoadingState(initialState);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { setIsLoading, setLoadingState };
}

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

export function useMapDataLayerSimpleQueryLoader(
  operation: Operation,
  mapData: MapData,
  skipped = false,
) {
  const initialLoadDone = !!(mapData.previousData ?? mapData) || skipped;
  return useMapDataLayerLoader(
    operation,
    initialLoadDone,
    mapData.loading && !skipped,
  );
}
