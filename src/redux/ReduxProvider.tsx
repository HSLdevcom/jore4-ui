import { FC } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

export const ReduxProvider: FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
