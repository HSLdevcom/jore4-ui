import { FC, useCallback, useEffect, useReducer } from 'react';
import { Api } from '../api';
import { UserContext } from './UserContext';
import { initialUserState, userReducer } from './UserReducer';

export const UserContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  const getUserInfo = useCallback(async () => {
    try {
      const response = await Api.user.getUserInfo();
      dispatch({ type: 'login_success', payload: response.data });
    } catch (error) {
      dispatch({ type: 'reset' });
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};
