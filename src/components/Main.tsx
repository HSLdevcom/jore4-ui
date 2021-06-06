import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../redux/store';
import { useEffect } from 'react';
import { getUserInfo } from '../redux/user/actions';

export function Main({ children }: { children: JSX.Element[] }) {
  const dispatch = useDispatch();
  const userInfo = useTypedSelector(state => state.user.userInfo);

  useEffect(() => {
    if (!userInfo) {
      dispatch(getUserInfo());
    }
  }, [userInfo, dispatch]);

  return (
    <div>
      {children}
    </div>
  );
}
