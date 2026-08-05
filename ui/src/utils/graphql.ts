// null values are valid for patches, so here checking for undefined values only
export const defaultTo = <V, D>(value: V, defaultValue: D) =>
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  value === undefined ? defaultValue : value;

/**
 * It seems that hasura requires function parameter arrays to be
 * formatted as follows: {1,2,3,4,5}. This function takes in
 * an array and formats it correctly for hasura.
 */
export const convertArrayTypeForHasura = <T>(
  array: ReadonlyArray<T>,
): string => {
  const convertedItems = array.map((item) => {
    // If there is array inside of array, we need to do the same conversion to
    // the inner array by calling this function recursively
    if (Array.isArray(item)) {
      return convertArrayTypeForHasura(item);
    }
    return item;
  });

  return `{${convertedItems.join(',')}}`;
};

/**
 * Previous programmers of the project did not know how to write and use types.
 * And thus in addition to the old codebase being riddles with any types, it is
 * also full of casts that not truly valid, or safe in any shape or manner.
 *
 * This function exists to document some of those problematic spots.
 * This fn was introduced as part of the 2026 summer code reorganization.
 * Fixing those casts would have been the proper thing to do, but that would
 * have resulted in extensive data-flow analysis, creation and redecoration
 * of functions and variables with new proper types.
 *
 * TODO: Fix any and all use sites of this and/or any derived functions, to use
 *       proper types instead.
 *
 * @param item An item to to be forcefully cast into the Target type
 */
export function illegalCast<Target>(item: unknown): Target {
  return item as unknown as Target;
}

/**
 * Previous programmers of the project did not know how to write and use types.
 * And thus in addition to the old codebase being riddles with any types, it is
 * also full of casts that not truly valid, or safe in any shape or manner.
 *
 * This function exists to document some of those problematic spots.
 * This fn was introduced as part of the 2026 summer code reorganization.
 * Fixing those casts would have been the proper thing to do, but that would
 * have resulted in extensive data-flow analysis, creation and redecoration
 * of functions and variables with new proper types.
 *
 * TODO: Fix any and all use sites of this and/or any derived functions, to use
 *       proper types instead.
 *
 * @param item An item to to be forcefully cast into the Target type
 */
export function illegalOptionalCast<Target>(item: unknown): Target | undefined {
  return (item as unknown as Target | undefined) ?? undefined;
}

type HasTypename<Name extends string> = { readonly __typename: Name };

export function hasTypeName<Name extends string>(
  input: unknown,
  name: Name,
): input is HasTypename<Name> {
  return (
    typeof input === 'object' &&
    input !== null &&
    '__typename' in input &&
    // eslint-disable-next-line no-underscore-dangle
    input.__typename === name
  );
}

export function isRoute(input: unknown): input is HasTypename<'route_route'> {
  return hasTypeName(input, 'route_route');
}

export function isLine(input: unknown): input is HasTypename<'route_line'> {
  return hasTypeName(input, 'route_line');
}

export function isRouteLineChangeHistory(
  input: unknown,
): input is HasTypename<'route_line_change_history'> {
  return hasTypeName(input, 'route_line_change_history');
}

export function isScheduledStopPoint(
  input: unknown,
): input is HasTypename<'service_pattern_scheduled_stop_point'> {
  return hasTypeName(input, 'service_pattern_scheduled_stop_point');
}

export function isValidBetween(
  input: unknown,
): input is HasTypename<'stop_registry_ValidBetween'> {
  return hasTypeName(input, 'stop_registry_ValidBetween');
}
