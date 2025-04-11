import { ApolloProvider as Provider } from '@apollo/client';
import { FC, PropsWithChildren } from 'react';
import { createGraphqlClient } from './client';

let graphqlClient: ReturnType<typeof createGraphqlClient> | null = null;

export const ApolloProvider: FC<PropsWithChildren> = ({ children }) => {
  // Initialize client only once, so we get only one cache instance.
  graphqlClient ??= createGraphqlClient();

  return <Provider client={graphqlClient}>{children}</Provider>;
};
