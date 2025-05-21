/**
 * Stand-in object for a logger. This is to be replaced with an actual logger.
 */
export const log = {
  error: (...data: ReadonlyArray<ExplicitAny>) => {
    // eslint-disable-next-line no-console
    console.error(...data);
  },
  warn: (...data: ReadonlyArray<ExplicitAny>) => {
    // eslint-disable-next-line no-console
    console.warn(...data);
  },
};
