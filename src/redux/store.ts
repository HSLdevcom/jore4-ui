import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { IAppState, reducers } from './reducers';

export const initStore = () => {
  const createReduxLogger = () => {
    return createLogger({
      collapsed: true,
      timestamp: false
    });
  };

  const getMiddlewares = () => {
    const middlewares: any = [thunkMiddleware];
    if (process.env.NODE_ENV === 'development') {
      middlewares.push(createReduxLogger());
    }

    return middlewares;
  };

  const reducer = combineReducers(reducers);

  return createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...getMiddlewares()))
  );
};

export const useTypedSelector: TypedUseSelectorHook<IAppState> = useSelector;
