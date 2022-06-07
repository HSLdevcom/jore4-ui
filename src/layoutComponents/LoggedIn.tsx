import React from 'react';
import { useAppSelector } from '../hooks';
import { selectUser } from '../redux';

/*
 * Convenience component for conditionally hiding components from
 * non-logged in users. Should be removed when proper user
 * permissions are implemented.
 */
export const LoggedIn: React.FC = ({ children }) => {
  const { userInfo } = useAppSelector(selectUser);
  const loggedIn = !!userInfo?.permissions;
  return loggedIn ? <>{children}</> : null;
};
