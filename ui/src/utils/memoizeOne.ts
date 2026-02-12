// Inspired by https://github.com/alexreardon/memoize-one

import pick from 'lodash/pick';
import { Dispatch, SetStateAction } from 'react';
import { areEqual } from './areEqual';

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

export function memoizePicker<T extends object, U extends keyof T>(
  props: ReadonlyArray<U>,
): (object: T) => Pick<T, U> {
  let cachedResult: Pick<T, U> | null = null;

  return (object) => {
    const newResult = pick(object, props);

    if (!areEqual(cachedResult, newResult)) {
      cachedResult = newResult;
    }

    return cachedResult as Pick<T, U>;
  };
}

export function memoizeStatePicker<T extends object, U extends keyof T>(
  props: ReadonlyArray<U>,
  setState: Dispatch<SetStateAction<T>>,
): {
  readonly getPickedState: (object: T) => Pick<T, U>;
  readonly setPickedState: Dispatch<SetStateAction<Pick<T, U>>>;
} {
  let cachedResult: Pick<T, U> | null = null;

  const getPickedState = (object: T): Pick<T, U> => {
    const newResult = pick(object, props);

    if (!areEqual(cachedResult, newResult)) {
      cachedResult = newResult;
    }

    return cachedResult as Pick<T, U>;
  };

  const setPickedState: Dispatch<SetStateAction<Pick<T, U>>> = (newState) => {
    setState((prevState) => {
      if (typeof newState === 'function') {
        const pickedPrevState: Pick<T, U> = pick(prevState, props);
        const changedState = newState(pickedPrevState);
        if (changedState !== pickedPrevState) {
          return { ...prevState, ...changedState };
        }
      }

      return { ...prevState, ...newState };
    });
  };

  return { getPickedState, setPickedState };
}
