import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { Api } from '../../api';
import { IUserInfo } from './types';

export const GET_USER_INFO_SUCCESS = createAction<IUserInfo>('GET_USER_INFO_SUCCESS');
export const GET_USER_INFO_FAILURE = createAction('GET_USER_INFO_FAILURE');

export function getUserInfo() {
  return async (dispatch: Dispatch): Promise<boolean> => {
    try {
      const userInfoResponse = await Api.user.getUserInfo();
      dispatch(GET_USER_INFO_SUCCESS(userInfoResponse.data));
      return true;
    } catch (err) {
      dispatch(GET_USER_INFO_FAILURE(err));
      return false;
    }
  }
}
