import {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithPayload,
  ActionCreatorWithPreparedPayload,
  ActionCreatorWithoutPayload,
  PayloadAction,
} from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
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
