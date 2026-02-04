import { ReactNode } from 'react';
import { areEqual } from '../../../../utils';
import { KeyedChangedValue, StringFieldChangedValue } from '../types';

/**
 * Replace nullable values with a more proper default value.
 * Usable in scenarios where the nullable value can be mapped to some non-null
 * empty value which, when represented to the user does not look any different.
 *
 * For example a null likely gets represented by an "empty field" on the UI,
 * just like an empty string '' would.
 *
 * @param value nullable value.
 * @param defaultValue value to return in case valu is null or undefined.
 */
export function optionalToDefault<ValueT, DefaultT = ValueT>(
  value: ValueT,
  defaultValue: Exclude<DefaultT, null | undefined>,
): Exclude<ValueT | DefaultT, null | undefined> {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  return value as Exclude<ValueT, null | undefined>;
}

/**
 * Map provided to value to a string, replacing nullable values with an empty
 * string, and mapping non-null values according to {@link Symbol.toStringTag}.
 * @param value
 */
export function toStringMapper<T>(value: T): string {
  return String(optionalToDefault(value, ''));
}

/**
 * Are the 2 given values equal according to the algorithm of {@link areEqual}.
 * Normalizes nullable values to the given defaultValue before comparison.
 *
 * @param defaultValue value to replace `null` and `undefined` with
 * @returns a curried comparator function
 */
export function areEqualWithDefault<ValueT, DefaultT>(
  defaultValue: Exclude<DefaultT, null | undefined>,
): (a: ValueT, b: ValueT) => boolean {
  return (a: ValueT, b: ValueT) => {
    const aOrDefault = optionalToDefault(a, defaultValue);
    const bOrDefault = optionalToDefault(b, defaultValue);

    return areEqual(aOrDefault, bOrDefault);
  };
}

function normalizeEmptyValue<ValueT>(
  value: ValueT,
): null | Exclude<ValueT, undefined> {
  if (value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value) && value.length === 0) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? (trimmed as Exclude<ValueT, undefined>) : null;
  }

  return value as Exclude<ValueT, undefined>;
}

/**
 * Are the 2 given values equal according to the algorithm of {@link areEqual},
 * with the exception that null = undefined = '' = [], as all of those map to an
 * empty field on the screen.
 *
 * @param a
 * @param b
 */
export function areEqualish<ValueT>(a: ValueT, b: ValueT): boolean {
  return areEqual(normalizeEmptyValue(a), normalizeEmptyValue(b));
}

type DiffValuesOptions<ValueT> = {
  // Name if the field that is being diffed
  readonly field: string;

  // Field value in previous version
  readonly oldValue: ValueT;

  // Field value in current version
  readonly newValue: ValueT;

  // Optionally use different comparator. Default is {@link areEqualish}
  readonly compare?: (a: ValueT, b: ValueT) => boolean;

  // Optional function to mape the value to it's ui representation,
  // such as an enum to string mapper. By default, uses {@link toStringMapper}.
  readonly mapper?: (v: ValueT) => ReactNode;
};

type DiffKeyedValuesOptions<ValueT> = Omit<
  DiffValuesOptions<ValueT>,
  'field'
> & {
  readonly field: ReactNode;
  readonly key: string;
};

/**
 * Compare and produce a ChangeValue data item for the given field and values.
 *
 * @param options
 */
export function diffValues<ValueT>({
  field,
  oldValue,
  newValue,
  compare = areEqualish,
  mapper = toStringMapper,
}: DiffValuesOptions<ValueT>): StringFieldChangedValue | null {
  if (compare(oldValue, newValue)) {
    return null;
  }

  return {
    field,
    oldValue: mapper(oldValue),
    newValue: mapper(newValue),
  };
}

/**
 * Compare and produce a ChangeValue data item for the given field and values.
 *
 * @param options
 */
export function diffKeyedValues<ValueT>({
  key,
  field,
  oldValue,
  newValue,
  compare = areEqualish,
  mapper = toStringMapper,
}: DiffKeyedValuesOptions<ValueT>): KeyedChangedValue | null {
  if (compare(oldValue, newValue)) {
    return null;
  }

  return {
    key,
    field,
    oldValue: mapper(oldValue),
    newValue: mapper(newValue),
  };
}

/**
 * Create a mapper with custom value for nullable cases.
 *
 * @param mapper mapper for non-nullable values.
 * @param defaultValue fallback value for nullable cases.
 */
export function mapNullable<ValueT>(
  mapper: (value: Exclude<ValueT, null | undefined>) => ReactNode,
  defaultValue: ReactNode = null,
): (value: ValueT) => ReactNode {
  return (value: ValueT) => {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    return mapper(value as Exclude<ValueT, null | undefined>);
  };
}
