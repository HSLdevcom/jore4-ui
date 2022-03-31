import { FC, useCallback, useEffect } from 'react';
import { Api } from '../api';
import { useAppDispatch } from '../hooks';
import { loginFailed, loginSuccess } from '../redux/slices/user';

export const UserProvider: FC = () => {
  const dispatch = useAppDispatch();

  const getUserInfo = useCallback(async () => {
    try {
      const response = await Api.user.getUserInfo();
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFailed);
    }
  }, [dispatch]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return null;
};
