import { ApolloCache, Reference, StoreObject } from '@apollo/client';
import { log } from './logger';

export const mapToObject = (object: ExplicitAny) => {
  return { object };
};

export const mapToVariables = (variables: ExplicitAny) => {
  return { variables };
};
export const mapToData = (data: ExplicitAny) => {
  return { data };
};

// null values are valid for patches, so here checking for undefined values only
export const defaultTo = <V, D>(value: V, defaultValue: D) =>
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  value === undefined ? defaultValue : value;

// Removes item from apollo's cache.
// TODO: do we really have to do this manually?
export const removeFromApolloCache = (
  cache: ApolloCache<ExplicitAny>,
  identity: StoreObject | Reference,
) => {
  try {
    // Based on https://stackoverflow.com/a/66713628
    const cached = cache.identify(identity);
    // @ts-expect-error something seems to be wrong here. The solution mentioned
    // above stackoverflow response won't give ts errors, but it doesn't work either...
    cache.evict(cached);
    cache.gc();
  } catch (e) {
    log.warn(
      `Failed to evict entity '\`${JSON.stringify(
        identity,
        null,
        0,
      )}\`' from Apollo cache! Reason:`,
      e,
    );
  }
};

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
