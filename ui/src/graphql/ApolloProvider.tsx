import { ApolloProvider as Provider } from '@apollo/client';
import { FC } from 'react';
import { createGraphqlClient } from './client';

export const ApolloProvider: FC = ({ children }) => {
  const graphqlClient = createGraphqlClient();
  return <Provider client={graphqlClient}>{children}</Provider>;
};
