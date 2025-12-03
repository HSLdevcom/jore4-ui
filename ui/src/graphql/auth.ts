import { ApolloLink } from '@apollo/client';

export const REQUESTED_HASURA_ROLE_HEADER = 'x-hasura-role';

export type Role = string;

export const roleHeaderMap = (hasuraRole: string) => {
  return { [REQUESTED_HASURA_ROLE_HEADER]: hasuraRole };
};

// TODO: avoid hardcoding role value. Use 'admin' for now
// to be able to continue development until things get sorted out
// regarding access control in hasura side
export const userHasuraRole = 'admin';

export const authRoleMiddleware = new ApolloLink((operation, forward) => {
  // const { role } = operation.variables;

  // add the requested authorization role to the headers if it is specified
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(userHasuraRole && roleHeaderMap(userHasuraRole)),
    },
  }));

  return forward(operation);
});
