export class PromiseCanceledError extends Error {}

export function filterCancellationError<T>(
  handler: (error: unknown) => T | undefined,
): (error: unknown) => T | undefined {
  return (error) => {
    if (error instanceof PromiseCanceledError) {
      return undefined;
    }

    return handler(error);
  };
}

/**
 *
 */
export function makePromiseCleanupHelper() {
  let cleanedUp = false;

  return {
    blockOnCleanup: <T>(value: T): T => {
      if (cleanedUp) {
        throw new PromiseCanceledError(
          'Promise then-chain blocked due to cleanup!',
        );
      }

      return value;
    },

    cleanup: () => {
      cleanedUp = true;
    },

    get cleanedUp() {
      return cleanedUp;
    },
  };
}
