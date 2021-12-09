import produce from 'immer';
import { UserInfo } from '../types/UserInfo';
import { UserContextData } from './UserContext';

export const initialUserState: UserContextData = {
  userInfo: undefined,
  loggedIn: false,
};

type UserInfoActions = 'reset' | 'login_success';

const reducer = (
  draft: UserContextData,
  action: {
    type: UserInfoActions;
    payload?: UserInfo;
  },
) => {
  const { type, payload } = action;
  switch (type) {
    case 'login_success':
      draft.userInfo = payload;
      draft.loggedIn = true;
      break;
    case 'reset':
      return initialUserState;
    default:
  }
  return draft;
};

export const userReducer = produce(reducer);
