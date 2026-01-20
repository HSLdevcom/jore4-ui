import { configureStore } from '@reduxjs/toolkit';
import { logger } from './middleware/logger';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === 'test') {
      // Don't enable logger in unit tests
      return getDefaultMiddleware();
    }

    return getDefaultMiddleware().concat(logger);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
