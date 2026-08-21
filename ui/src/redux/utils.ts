import {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithPayload,
  ActionCreatorWithPreparedPayload,
  ActionCreatorWithoutPayload,
  PayloadAction,
} from '@reduxjs/toolkit';
import { useCallback, useEffect } from 'react';
import {
  TypedUseSelectorHook,
  UseDispatch,
  useDispatch,
  useSelector,
} from 'react-redux';
import { LoadingState } from '../types';
import {
  Operation,
  setLoadingAction,
  setLoadingStateAction,
} from './slices/loader';
import { AppDispatch, RootState } from './store';

export const useAppDispatch: UseDispatch<AppDispatch> = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Dispacted versions of ActionCreator -types. === Just the callable function part.
type ActionDispatcherWithoutPayload<TType extends string> = () => PayloadAction<
  undefined,
  TType
>;

type ActionDispatcherWithPayload<TPayload, TType extends string> = (
  payload: TPayload,
) => PayloadAction<TPayload, TType>;

type ActionDispatcherWithOptionalPayload<TPayload, TType extends string> = (
  payload?: TPayload,
) => PayloadAction<TPayload, TType>;

type ActionDispatcherWithPreparedPayload<
  TPayload,
  TInput extends unknown[],
  TType extends string,
> = (...args: TInput) => PayloadAction<TPayload, TType>;

// Proper overload for each individual ActionCreator -type.
// Includes proper typings for multi argument prepared actions.
export function useAppAction<TType extends string>(
  action: ActionCreatorWithoutPayload<TType>,
): ActionDispatcherWithoutPayload<TType>;

export function useAppAction<TPayload, TType extends string>(
  action: ActionCreatorWithPayload<TPayload, TType>,
): ActionDispatcherWithPayload<TPayload, TType>;

export function useAppAction<TPayload, TType extends string>(
  action: ActionCreatorWithOptionalPayload<TPayload, TType>,
): ActionDispatcherWithOptionalPayload<TPayload, TType>;

export function useAppAction<
  TPayload,
  TInput extends unknown[],
  TType extends string,
>(
  action: ActionCreatorWithPreparedPayload<TInput, TPayload, TType>,
): ActionDispatcherWithPreparedPayload<TPayload, TInput, TType>;

export function useAppAction(action: ExplicitAny): ExplicitAny {
  const dispatch = useAppDispatch();
  return useCallback(
    (...params: ExplicitAny[]) => dispatch(action(...params)),
    [dispatch, action],
  );
}

type LoaderOptions = {
  readonly initialState?: LoadingState;
};

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
