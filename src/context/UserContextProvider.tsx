import { ReactNode, useCallback, useEffect, useReducer } from 'react';
import { Api } from '../api';
import { userContext } from './UserContext';
import {
  GET_USER_INFO_FAILURE,
  GET_USER_INFO_SUCCESS,
  initialUserState,
  userReducer,
} from './UserReducer';

interface Props {
  children: ReactNode;
}

export const UserContextProvider = (props: Props) => {
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

  const { children } = props;

  return (
    <userContext.Provider
      value={{
        userInfo: state.userInfo,
        loggedIn: state.loggedIn,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
