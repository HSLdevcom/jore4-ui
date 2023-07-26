import fetch from 'cross-fetch';
import { CurrentExecutorIndex } from './db-helpers/enums';

// integration tests need this in the CI
const localHasuraURL: Record<CurrentExecutorIndex, string> = {
  [CurrentExecutorIndex.e2e1]: 'http://127.0.0.1:3211/v1/graphql',
  [CurrentExecutorIndex.e2e2]: 'http://127.0.0.1:3212/v1/graphql',
  [CurrentExecutorIndex.e2e3]: 'http://127.0.0.1:3213/v1/graphql',
  [CurrentExecutorIndex.default]: 'http://127.0.0.1:3201/v1/graphql',
};

// e2e tests need this in the CI
const ciHasuraURL: Record<CurrentExecutorIndex, string> = {
  [CurrentExecutorIndex.e2e1]: 'http://jore4-hasura-e2e1:8080/v1/graphql',
  [CurrentExecutorIndex.e2e2]: 'http://jore4-hasura-e2e2:8080/v1/graphql',
  [CurrentExecutorIndex.e2e3]: 'http://jore4-hasura-e2e3:8080/v1/graphql',
  [CurrentExecutorIndex.default]: 'http://jore4-hasura:8080/v1/graphql',
};

const getHasuraURL = () => {
  const currentExecutorIndex =
    process.env.CYPRESS_THREAD || CurrentExecutorIndex.default;

  if (process.env.CI && process.env.CYPRESS_E2E === 'true') {
    return ciHasuraURL[currentExecutorIndex];
  }
  return localHasuraURL[currentExecutorIndex];
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
