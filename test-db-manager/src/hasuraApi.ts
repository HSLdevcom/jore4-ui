import fetch from 'cross-fetch';
import { DocumentNode } from 'graphql';
import { getGqlString } from './builders/mutations/utils';

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

const getHasuraAuthenticationHeaders = (): { [key: string]: string } => {
  if (process.env.HASURA_API_COOKIE) {
    return {
      Cookie: process.env.HASURA_API_COOKIE, // Eg. 'SESSION=AbcAbcAbc...'
      'x-hasura-role': 'admin',
    };
  }

  return {
    'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET ?? 'hasura',
  };
};

export type HasuraStringQueryBody<
  Variables extends Readonly<Record<string, unknown>>,
> = {
  readonly operationName?: string;
  readonly query: string;
  readonly variables?: Variables;
};

export type HasuraDocumentNodeQueryBody<
  Variables extends Readonly<Record<string, unknown>>,
> = {
  readonly query: DocumentNode;
  readonly variables?: Variables;
};

export type HasuraQueryBody<
  Variables extends Readonly<Record<string, unknown>>,
> = HasuraStringQueryBody<Variables> | HasuraDocumentNodeQueryBody<Variables>;

export type HasuraErrorLocation = {
  readonly line: number;
  readonly column: number;
};

export type HasuraError = {
  readonly message: string;
  readonly locations?: ReadonlyArray<HasuraErrorLocation>;
  readonly path?: ReadonlyArray<string | number>;
};

export type HasuraResponseBody<Data> = {
  readonly errors?: ReadonlyArray<HasuraError>;
  readonly data?: Data;
};

type HasuraBodyRequestInit<
  Variables extends Readonly<Record<string, unknown>>,
> = Omit<RequestInit, 'body'> & {
  readonly body: HasuraStringQueryBody<Variables>;
};

const contentTypeHeader = 'content-type';
const contentTypeJson = 'application/json; charset=utf-8';

class HasuraException extends Error {
  readonly request: HasuraBodyRequestInit<Readonly<Record<string, unknown>>>;

  readonly response: HasuraResponseBody<unknown>;

  constructor(
    request: HasuraBodyRequestInit<Readonly<Record<string, unknown>>>,
    response: HasuraResponseBody<unknown>,
  ) {
    super(
      `Hasura response contains errors! Request and response:\n${JSON.stringify({ request, response }, null, 2)}`,
    );

    this.request = request;
    this.response = response;
  }
}

function processHasuraRequestBody<
  Variables extends Readonly<Record<string, unknown>>,
>(body: HasuraQueryBody<Variables>): HasuraStringQueryBody<Variables> {
  if (typeof body.query === 'string') {
    return body as HasuraStringQueryBody<Variables>;
  }

  return {
    operationName: body.query.definitions.find(
      (def) => def.kind === 'OperationDefinition',
    )?.name?.value,
    query: getGqlString(body.query),
    variables: body.variables,
  };
}

export async function hasuraApi<
  Data = unknown,
  Variables extends Readonly<Record<string, unknown>> = Readonly<
    Record<string, unknown>
  >,
>(
  requestBody: HasuraQueryBody<Variables>,
  expectNoErrors = false,
): Promise<HasuraResponseBody<Data>> {
  const reqWithRawBody: HasuraBodyRequestInit<Variables> = {
    method: 'POST',
    body: processHasuraRequestBody(requestBody),
    headers: {
      [contentTypeHeader]: contentTypeJson,
      ...getHasuraAuthenticationHeaders(),
    },
  };

  const response = await fetch(getHasuraURL(), {
    ...reqWithRawBody,
    body: JSON.stringify(reqWithRawBody.body),
  });

  if (
    !response.ok ||
    response.headers.get(contentTypeHeader) !== contentTypeJson
  ) {
    const requestAndResponse = JSON.stringify(
      {
        request: reqWithRawBody,
        response: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: await response.text(),
        },
      },
      null,
      2,
    );

    throw new Error(
      `Hasura request failed! Request and response data:\n${requestAndResponse}`,
    );
  }

  const body: HasuraResponseBody<Data> = await response.json();

  if (expectNoErrors && body.errors?.length) {
    throw new HasuraException(reqWithRawBody, body);
  }

  return body;
}
