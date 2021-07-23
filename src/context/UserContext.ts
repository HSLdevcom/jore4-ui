import { Context, createContext, useContext } from 'react';
import { UserInfo } from '../types/UserInfo';

export interface UserContextData {
  loggedIn: boolean;
  userInfo?: UserInfo;
}

export const UserContext: Context<UserContextData | undefined> = createContext<
  UserContextData | undefined
>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      'User context not provided, please use UserContextProvider',
    );
  }
  return context;
};
