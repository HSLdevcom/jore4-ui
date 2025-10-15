// Inspired by https://github.com/alexreardon/memoize-one

type ComparatorFn<T> = (a: T, b: T) => boolean;

function paramsAreEqual(
  last: ReadonlyArray<unknown>,
  next: ReadonlyArray<unknown>,
  comparator: ComparatorFn<unknown>,
) {
  if (last.length !== next.length) {
    return false;
  }

  for (let i = 0; i < last.length; i += 1) {
    if (!comparator(last[i], next[i])) {
      return false;
    }
  }

  return true;
}

type Cache<TFunc extends (...args: ExplicitAny[]) => ExplicitAny> = {
  params: Parameters<TFunc> | null;
  result: ReturnType<TFunc> | null;
};

/**
 * Create a memoized version of the given function
 *
 * Only has a single cache slot. Thus, multiple consecutive calls with
 * the same arguments, provide the same result with referential equality.
 *
 * Additionally, if the parameters change, but the final result is comparatively
 * same, the old reference is returned.
 *
 * Does not support functions that use `this`.
 * By default, uses Object.is to compare the function parameters.
 *
 * @param fn function to memoize
 * @param comparator function to compare individual parameters with
 */
export function memoizeOne<
  TFunc extends (...args: ReadonlyArray<ExplicitAny>) => ExplicitAny,
>(fn: TFunc, comparator: ComparatorFn<unknown> = Object.is): TFunc {
  const cache: Cache<TFunc> = {
    params: null,
    result: null,
  };

  return ((...args: Parameters<TFunc>): ReturnType<TFunc> => {
    if (
      cache.params === null ||
      !paramsAreEqual(cache.params, args, comparator)
    ) {
      const newResult = fn.call(null, ...args) as ReturnType<TFunc>;
      if (!comparator(cache.result, newResult)) {
        cache.result = newResult;
      }
      cache.params = args as Parameters<TFunc>;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.result!;
  }) as TFunc;
}
