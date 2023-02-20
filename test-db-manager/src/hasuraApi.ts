import fetch from 'cross-fetch';

export const hasuraApi = async (jsonPayload: unknown): Promise<unknown> => {
  const req = {
    method: 'POST',
    body: JSON.stringify(jsonPayload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'hasura',
    },
  };
  return fetch(
    process.env.HASURA_API_URL || 'http://127.0.0.1:3201/v1/graphql',
    req,
  ).then((response) => response.json());
};
