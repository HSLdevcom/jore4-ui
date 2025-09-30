import { knownPriorityValues } from '../../../types/enums';

export const SEPARATOR = ',';

export function serializeArray<ValueT>(values: ReadonlyArray<ValueT>): string {
  return values.map(String).join(SEPARATOR);
}

/**
 * Split string into array on separator, with handling for empty strings.
 *
 * @param value string to split
 * @param separator string to split on
 */
export function splitString(
  value: string,
  separator: string = SEPARATOR,
): Array<string> {
  if (value.length === 0) {
    return [];
  }

  return value.split(separator);
}

/**
 * Create a deserializer for String enum `enum My { A='a', B='b' }`
 *
 * @param knownValues Object.values(MyEnum)
 */
export function toEnum<T extends string | number>(
  knownValues: ReadonlyArray<T>,
): (value: T extends string ? string : number) => T {
  return (value) => {
    if (knownValues.includes(value as ExplicitAny)) {
      return value as unknown as T;
    }

    throw new TypeError(
      `Value (${value}) is not a valid enum value! Known values are: ${knownValues}`,
    );
  };
}

const toPriority = toEnum(knownPriorityValues);

export function parsePriorities(value: string) {
  return splitString(value).map(Number).map(toPriority);
}
