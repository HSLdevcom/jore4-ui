import {
  ActionCreatorWithPayload,
  ActionCreatorWithPreparedPayload,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppAction = <
  TPayload extends ExplicitAny,
  TActionPayload extends ExplicitAny,
>(
  action:
    | ActionCreatorWithPreparedPayload<TPayload[], TActionPayload, string>
    | ActionCreatorWithPayload<TPayload, string>,
) => {
  const dispatch = useAppDispatch();
  return (actionPayload: TPayload) => dispatch(action(actionPayload));
};
