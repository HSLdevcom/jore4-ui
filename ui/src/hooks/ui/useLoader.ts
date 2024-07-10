import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Operation, setLoadingAction } from '../../redux';

interface LoaderOptions {
  immediatelyOn?: boolean;
}

export const useLoader = (operation: Operation, options?: LoaderOptions) => {
  const dispatch = useDispatch();

  const setIsLoading = useCallback(
    (isLoading: boolean) =>
      dispatch(setLoadingAction({ operation, isLoading })),
    [dispatch, operation],
  );

  useEffect(() => {
    setIsLoading(!!options?.immediatelyOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { setIsLoading };
};
