import { ApolloCache, Reference, StoreObject } from '@apollo/client';

export const mapToObject = (object: ExplicitAny) => {
  return { object };
};

export const mapToVariables = (variables: ExplicitAny) => {
  return { variables };
};

// null values are valid for patches, so here checking for undefined values only
export const defaultTo = <V, D>(value: V, defaultValue: D) =>
  value === undefined ? defaultValue : value;

// Removes item from apollo's cache.
// TODO: do we really have to do this manually?
export const removeFromApolloCache = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache: ApolloCache<any>,
  identity: StoreObject | Reference,
) => {
  // Based on https://stackoverflow.com/a/66713628
  const cached = cache.identify(identity);
  // @ts-expect-error something seems to be wrong here. The solution mentioned
  // above stackoverflow response won't give ts errors, but it doesn't work either...
  cache.evict(cached);
  cache.gc();
};

/**
 * It seems that hasura requires function parameter arrays to be
 * formatted as follows: {1, 2, 3, 4, 5}. This function takes in
 * an array and formats it correctly for hasura.
 */
export const generateArrayTypeForHasura = <T>(array: T[]) =>
  JSON.stringify(array).replace('[', '{').replace(']', '}');
