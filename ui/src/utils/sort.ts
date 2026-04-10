import identity from 'lodash/identity';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SortOrder } from '../types';
import { areEqual } from './areEqual';
import { memoizeOne } from './memoizeOne';

export function sortAlphabetically<T>(
  array: ReadonlyArray<T>,
  attribute: keyof T,
): T[] {
  return array.toSorted((a, b) =>
    String(a[attribute]).localeCompare(String(b[attribute])),
  );
}

export function sortReverseAlphabetically<T>(
  array: ReadonlyArray<T>,
  attribute: keyof T,
): T[] {
  return sortAlphabetically(array, attribute).reverse();
}

export type NullOrder = 'NullsFirst' | 'NullsLast';
export type Comparator<T> = (a: T, b: T) => number;
export type Order<T> = (comparator: Comparator<T>) => Comparator<T>;

export function getOrder<T>(sortOrder: SortOrder): Order<T> {
  if (sortOrder === SortOrder.ASCENDING) {
    return identity;
  }

  return (comparator) => (a, b) => -comparator(a, b);
}

export function comparePrimitive(a: number, b: number): number;
export function comparePrimitive(a: bigint, b: bigint): number;
export function comparePrimitive(a: string, b: string): number;
export function comparePrimitive(a: boolean, b: boolean): number;
export function comparePrimitive<T extends number | bigint | string | boolean>(
  a: T,
  b: T,
): number {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

export function compareValues<ValueT>(
  rawA: ValueT,
  rawB: ValueT,
  compareNonNullable: Comparator<NonNullable<ValueT>>,
  nullOrder: NullOrder = 'NullsLast',
): number {
  const a = rawA ?? null;
  const b = rawB ?? null;

  if (a !== null && b !== null) {
    return compareNonNullable(a, b);
  }

  if (a === null && b !== null) {
    return nullOrder === 'NullsLast'
      ? Number.NEGATIVE_INFINITY
      : Number.POSITIVE_INFINITY;
  }

  if (b === null && a !== null) {
    return nullOrder === 'NullsLast'
      ? Number.POSITIVE_INFINITY
      : Number.NEGATIVE_INFINITY;
  }

  return 0;
}

export function chainedComparator<T>(
  ...comparators: ReadonlyArray<Comparator<T>>
): Comparator<T> {
  return (a, b) => {
    let result = 0;

    for (const comparator of comparators) {
      result = comparator(a, b);
      if (result !== 0) {
        return result;
      }
    }

    return result;
  };
}

export function useCollator(options?: Intl.CollatorOptions) {
  const { t } = useTranslation();
  const langCode = t(($) => $.languages.intlLangCode);
  return useRef(memoizeOne(Intl.Collator, areEqual)).current(langCode, options);
}
