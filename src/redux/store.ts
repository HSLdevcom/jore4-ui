import { configureStore } from '@reduxjs/toolkit';
import { logger } from './middleware/logger';
// eslint-disable-next-line import/no-cycle
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
