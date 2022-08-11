import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Operation, setLoadingAction } from '../redux';

export const useLoader = (operation: Operation) => {
  const dispatch = useDispatch();

  const setIsLoading = useCallback(
    (isLoading: boolean) =>
      dispatch(setLoadingAction({ operation, isLoading })),
    [dispatch, operation],
  );

  return { setIsLoading };
};
