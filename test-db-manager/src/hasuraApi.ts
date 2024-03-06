import fetch from 'cross-fetch';

enum HasuraURL {
  Dev = 'http://127.0.0.1:3201/v1/graphql',
  E2E = 'http://127.0.0.1:3201/v1/graphql',
  CI = 'http://jore4-hasura:8080/v1/graphql',
}

const getHasuraURL = () => {
  if (process.env.CI === '1' && process.env.CYPRESS === 'true') {
    return HasuraURL.CI;
  }
  if (process.env.CI === undefined && process.env.CYPRESS === 'true') {
    return HasuraURL.E2E;
  }
  return HasuraURL.Dev;
};

export const hasuraApi = async (jsonPayload: unknown): Promise<unknown> => {
  const req = {
    method: 'POST',
    body: JSON.stringify(jsonPayload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'hasura',
    },
  };
  return fetch(getHasuraURL(), req).then((response) => response.json());
};
