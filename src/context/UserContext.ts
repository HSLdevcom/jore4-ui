import { Context, createContext, useContext } from 'react';
import { UserInfo } from '../types/UserInfo';

export interface UserContext {
  loggedIn: boolean;
  userInfo: UserInfo | null;
}

export const userContext: Context<UserContext | undefined> = createContext<
  UserContext | undefined
>(undefined);

export const useUserContext = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error(
      'user context not provided, please use UserContextProvider',
    );
  }
  return context;
};
