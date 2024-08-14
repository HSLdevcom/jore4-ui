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

type PromiseCleanupHelper = {
  /**
   * Function to be inserted in middle of a then-chain
   * to skip the rest of the chain.
   */
  readonly blockOnCleanup: <T>(value: T) => T;

  /**
   * Function that sets the helper into canceled state,
   * thus triggering blockOnCleanup to throw cancellation errors.
   */
  readonly cleanup: () => void;

  /** Allows one to check the current state of the helper */
  readonly cleanedUp: boolean;
};

/**
 * A helper to ease working with Promises in useEffect.
 *
 * Promises cannot be canceled and thus can lead to problems when used in
 * useEffect hooks, if the end action of the Promise chain should not be
 * performed in case the useEffect hook has been executed again, with other
 * parameters.
 *
 * Usage example:
 * <code>
 *   <pre>
 *     const [id, setId] = useState(null);
 *     const [areaToEdit, setAreaToEdit] = useReduxMagic();
 *     const asyncLoadData = useAsyncLoadArea();
 *
 *     useEffect(() => {
 *       const cleanupHelper = makePromiseCleanupHelper();
 *
 *       setAreaToEdit(null);
 *       asyncLoadData(id)
 *         // If current useEffect cycle has been marked as cleaned up when the
 *         // actual data loading promise fulfills, throw an Error instead of
 *         // continuing the then-chain. Else just pass through the data, and
 *         // continue with the then-chain.
 *         .then(cleanupHelper.blockOnCleanup)
 *
 *         // If id was to change again before the previous item was loaded
 *         // it could cause a race condition where bot id and areaToEdit are
 *         // set, but have conflicting data.
 *
 *         // In worse case scenario the second fetch might complete before
 *         // the 1st one, thus for a moment setting in correct data, just for
 *         // it to get overridden by data-1 moments after.
 *         // Thus it is important to clean up and cancel old promises in
 *         // useEffect hooks.
 *         .then(setAreaToEdit)
 *         .catch(handleErrorAndOrPromiseCancellation);
 *
 *       return cleanupHelper.cleanup;
 *     }, [id, asyncLoadData]);
 *   </pre>
 * </code>
 *
 * @returns {PromiseCleanupHelper}
 */
export function makePromiseCleanupHelper(): PromiseCleanupHelper {
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
