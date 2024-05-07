import fetch from 'cross-fetch';

enum HasuraURL {
  Dev = 'http://127.0.0.1:3201/v1/graphql',
  E2E = 'http://127.0.0.1:3211/v1/graphql',
  CI = 'http://jore4-hasura:8080/v1/graphql',
}

const getHasuraURL = () => {
  if (process.env.HASURA_URL) {
    return process.env.HASURA_URL;
  }
  if (process.env.CI === '1' && process.env.CYPRESS === 'true') {
    return HasuraURL.CI;
  }
  if (process.env.CI === undefined && process.env.CYPRESS === 'true') {
    return HasuraURL.E2E;
  }
  return HasuraURL.Dev;
};

const getHasuraAuthenticationHeaders = () => {
  if (process.env.HASURA_API_COOKIE) {
    return {
      Cookie: process.env.HASURA_API_COOKIE, // Eg. 'SESSION=AbcAbcAbc...'
      'x-hasura-role': 'admin',
    };
  }

  return {
    'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || 'hasura',
  };
};

export const hasuraApi = async (jsonPayload: unknown): Promise<unknown> => {
  const req = {
    method: 'POST',
    body: JSON.stringify(jsonPayload),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      ...getHasuraAuthenticationHeaders(),
    },
  };
  return fetch(getHasuraURL(), req).then((response) => response.json());
};
