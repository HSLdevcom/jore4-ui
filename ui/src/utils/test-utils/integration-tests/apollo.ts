import { ApolloLink } from '@apollo/client';

export const mockApolloLink = new ApolloLink((operation, forward) => {
  // operation.setContext({ start: new Date() });
  return forward(operation);
});
