import { ApolloClient, useApolloClient } from '@apollo/client';
import { addProtocol } from 'maplibre-gl';
import { useEffect } from 'react';
import { ApolloQueryHandler } from './ApolloQueryHandler';
import { apolloProtocol } from './consts';
import { ApolloUnknownQueryError } from './errors';
import { getStringArg, parseApolloProtocolURL } from './helpers';
import { getInfraLinksMVT } from './Queries';

const apolloProtocolKnownQueries = {
  GetInfraLinksMVT: getInfraLinksMVT,
} as const satisfies Record<string, ApolloQueryHandler<unknown>>;

function addApolloProtocol(apollo: ApolloClient) {
  addProtocol(apolloProtocol, (requestParameters, abortController) => {
    const params = parseApolloProtocolURL(requestParameters.url);
    const query = getStringArg(params, 'query');

    if (query in apolloProtocolKnownQueries) {
      return apolloProtocolKnownQueries[
        query as keyof typeof apolloProtocolKnownQueries
      ](apollo, params, requestParameters, abortController);
    }

    throw new ApolloUnknownQueryError(
      query,
      Object.keys(apolloProtocolKnownQueries),
    );
  });
}

/**
 * Registers support for 'apollo://jore/' style links to fetch MapLibre
 * Source data directly from the DB, using GraphQL queries trough apollo.
 */
export function useRegisterApolloProtocol() {
  const apollo = useApolloClient();

  useEffect(() => addApolloProtocol(apollo), [apollo]);
}
