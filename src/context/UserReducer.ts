import { UserInfo } from '../types/UserInfo';
import { UserContextData } from './UserContext';

export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = 'GET_USER_INFO_FAILURE';

export const initialUserState: UserContextData = {
  userInfo: undefined,
  loggedIn: false,
};

export const userReducer = (
  state: UserContextData,
  action: { type: string; payload?: UserInfo },
) => {
  const { type, payload } = action;

  switch (type) {
    case GET_USER_INFO_SUCCESS:
      return {
        ...state,
        userInfo: payload,
        loggedIn: true,
      };
    case GET_USER_INFO_FAILURE:
      return {
        ...state,
        ...initialUserState,
      };
    default:
      return state;
  }
};
