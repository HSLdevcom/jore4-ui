import { createLogger } from 'redux-logger';

export const logger = createLogger({
  level: {
    prevState: false, // don't log previous state as it can se seen from previous log entry
    nextState: 'log',
    action: 'log',
    error: 'error',
  },
});
