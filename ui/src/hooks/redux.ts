import {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithPayload,
  ActionCreatorWithPreparedPayload,
  ActionCreatorWithoutPayload,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppAction = <
  TPayload extends ExplicitAny,
  TActionPayload extends ExplicitAny,
>(
  action:
    | ActionCreatorWithOptionalPayload<TPayload>
    | ActionCreatorWithPreparedPayload<TPayload[], TActionPayload>
    | ActionCreatorWithPayload<TPayload>
    | ActionCreatorWithoutPayload,
) => {
  const dispatch = useAppDispatch();
  return (actionPayload: TPayload) => dispatch(action(actionPayload));
};
