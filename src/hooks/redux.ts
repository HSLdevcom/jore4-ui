import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppAction = <TPayload extends ExplicitAny>(
  action: ActionCreatorWithOptionalPayload<TPayload>,
) => {
  const dispatch = useAppDispatch();
  return (actionPayload: TPayload) => dispatch(action(actionPayload));
};
