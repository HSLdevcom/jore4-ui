import fetch from 'cross-fetch';
import { CurrentExecutorIndex } from './db-helpers/enums/currentExecutorIndex';

const hasuraURL: Record<CurrentExecutorIndex, string> = {
  [CurrentExecutorIndex.e2e1]: 'http://127.0.0.1:3211/v1/graphql',
  [CurrentExecutorIndex.e2e2]: 'http://127.0.0.1:3212/v1/graphql',
  [CurrentExecutorIndex.e2e3]: 'http://127.0.0.1:3213/v1/graphql',
  [CurrentExecutorIndex.default]: 'http://127.0.0.1:3201/v1/graphql',
};

const getHasuraURL = () => {
  const currentExecutorIndex =
    process.env.CYPRESS_THREAD || CurrentExecutorIndex.default;

  return hasuraURL[currentExecutorIndex];
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
  return fetch(process.env.HASURA_API_URL || getHasuraURL(), req).then(
    (response) => response.json(),
  );
};
