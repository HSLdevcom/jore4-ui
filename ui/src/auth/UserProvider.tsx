import { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { Api } from '../api';
import { useAppDispatch } from '../hooks';
import { loginFailedAction, loginSuccessAction } from '../redux';

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  const getUserInfo = useCallback(async () => {
    try {
      const response = await Api.user.getUserInfo();
      dispatch(loginSuccessAction(response.data));
    } catch {
      dispatch(loginFailedAction());
    }
  }, [dispatch]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return children;
};
