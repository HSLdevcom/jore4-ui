import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  LoadingState,
  Operation,
  setLoadingAction,
  setLoadingStateAction,
} from '../../redux';

interface LoaderOptions {
  immediatelyOn?: boolean | LoadingState;
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
    const immediatelyOn = options?.immediatelyOn;

    switch (immediatelyOn) {
      case true:
        setLoadingState(LoadingState.HighPriority);
        break;

      case false:
        setLoadingState(LoadingState.NotLoading);
        break;

      case undefined:
        break;

      default:
        setLoadingState(immediatelyOn);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { setIsLoading, setLoadingState };
}
