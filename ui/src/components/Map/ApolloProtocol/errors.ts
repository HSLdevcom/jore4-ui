/* eslint-disable max-classes-per-file */

import type { ApolloError } from '@apollo/client/errors';
import { apolloHost, apolloPath, apolloProtocol } from './consts';

export class ApolloProtocolError extends Error {}

export class ApolloURLError extends ApolloProtocolError {
  public url: URL;

  constructor(url: URL, message: string) {
    super(message);
    this.url = url;
  }
}

export class InvalidProtocolError extends ApolloURLError {
  constructor(url: URL) {
    super(
      url,
      `Protocol was (${url.protocol}) but expected (${apolloProtocol})`,
    );
  }
}

export class InvalidHostError extends ApolloURLError {
  constructor(url: URL) {
    super(url, `Host was (${url.host}) but expected (${apolloHost})`);
  }
}

export class InvalidPathError extends ApolloURLError {
  constructor(url: URL) {
    super(url, `Path was (${url.pathname}) but expected (${apolloPath})`);
  }
}

export class ApolloQueryArgsError extends ApolloProtocolError {
  public params: URLSearchParams;

  constructor(params: URLSearchParams, message: string) {
    super(message);
    this.params = params;
  }
}

export class ApolloUnknownQueryError extends ApolloProtocolError {
  public query: string;

  constructor(query: string, knownQueries: ReadonlyArray<string>) {
    super(`Unknown query (${query}), known queries: ${knownQueries}`);
    this.query = query;
  }
}

export class ApolloAbortedError extends ApolloProtocolError {
  public name = 'AbortError';

  constructor(signal: AbortSignal) {
    super(`Request aborted! Reason: ${signal.reason}`, {
      cause: signal.reason,
    });
  }
}

export class ApolloExecutionError extends ApolloProtocolError {
  public queryName: string;

  public variables: Readonly<Record<string, unknown>>;

  constructor(
    queryName: string,
    variables: Readonly<Record<string, unknown>>,
    cause: ApolloError,
  ) {
    super(`Failed to execute query ${queryName}. Reason: ${cause.message}`, {
      cause,
    });
    this.queryName = queryName;
    this.variables = variables;
  }
}
