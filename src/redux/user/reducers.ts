import { handleActions } from 'redux-actions';
import {
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE
} from './actions';
import { IUser } from './types';

const initialState: IUser = {
  userInfo: undefined
};

export const reducer = handleActions<IUser, any>(
  {
    [GET_USER_INFO_SUCCESS as any]: (state, action) => ({
      ...state,
      userInfo: action.payload
    }),
    [GET_USER_INFO_FAILURE as any]: () => initialState
  },
  initialState
);
