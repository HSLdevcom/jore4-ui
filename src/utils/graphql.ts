import { ApolloCache, Reference, StoreObject } from '@apollo/client';
import { Scalars } from '../generated/graphql';
import { Point } from '../types';

export const mapToObject = (object: ExplicitAny) => {
  return { object };
};

export const mapToVariables = (variables: ExplicitAny) => {
  return { variables };
};

export const mapPointToPointGeography = ({
  latitude,
  longitude,
}: Point): Scalars['geography'] => {
  // TODO: where should we get z-coordinate? Api schema requires it.
  // Use 0 as z-coordinate for now.
  return { type: 'Point', coordinates: [longitude, latitude, 0] };
};

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
