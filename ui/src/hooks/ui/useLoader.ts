import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
