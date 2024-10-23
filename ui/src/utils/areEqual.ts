import isEqualWith from 'lodash/isEqualWith';

type HasEquals = { readonly equals: (other: unknown) => boolean };

function hasEquals(value: unknown): value is HasEquals {
  return (
    typeof value === 'object' &&
    value !== null &&
    'equals' in value &&
    typeof value.equals === 'function'
  );
}

/**
 * Lodash isEqual with proper handling for classes with custom equals methods.
 * Such as Luxon DateTime.
 *
 * @param a
 * @param b
 */
export function areEqual(a: unknown, b: unknown): boolean {
  return isEqualWith(a, b, (subA, subB) => {
    if (hasEquals(subA) && hasEquals(subB)) {
      return subA.equals(subB);
    }

    return undefined;
  });
}
