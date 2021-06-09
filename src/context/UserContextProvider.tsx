import { ReactNode, useCallback, useEffect, useReducer } from 'react';
import { Api } from '../api';
import { UserContext } from './UserContext';
import {
  GET_USER_INFO_FAILURE,
  GET_USER_INFO_SUCCESS,
  initialUserState,
  userReducer,
} from './UserReducer';

interface Props {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  const getUserInfo = useCallback(async () => {
    try {
      const response = await Api.user.getUserInfo();
      dispatch({ type: GET_USER_INFO_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_USER_INFO_FAILURE });
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};
