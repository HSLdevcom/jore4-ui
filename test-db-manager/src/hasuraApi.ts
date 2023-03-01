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

  // default instance = thread4, e2e1 = thread1, etc
  const currentExecutorIndex = process.env.CYPRESS_THREAD || '4';

  let hasuraUrl = '';
  switch (currentExecutorIndex) {
    // jore4-hasura-e2e1
    case '1':
      hasuraUrl = 'http://127.0.0.1:3211/v1/graphql';
      break;
    // jore4-hasura-e2e2
    case '2':
      hasuraUrl = 'http://127.0.0.1:3212/v1/graphql';
      break;
    // jore4-hasura-e2e3
    case '3':
      hasuraUrl = 'http://127.0.0.1:3213/v1/graphql';
      break;
    // jore4-hasura
    default:
      hasuraUrl = 'http://127.0.0.1:3201/v1/graphql';
      break;
  }
  return fetch(process.env.HASURA_API_URL || hasuraUrl, req).then((response) =>
    response.json(),
  );
};
