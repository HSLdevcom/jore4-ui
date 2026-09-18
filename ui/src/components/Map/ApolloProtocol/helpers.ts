import { apolloHost, apolloPath, apolloProtocol } from './consts';
import {
  ApolloQueryArgsError,
  InvalidHostError,
  InvalidPathError,
  InvalidProtocolError,
} from './errors';

export function parseApolloProtocolURL(url: string) {
  const parsed = new URL(url);

  if (parsed.protocol !== `${apolloProtocol}:`) {
    throw new InvalidProtocolError(parsed);
  }

  if (parsed.host !== apolloHost) {
    throw new InvalidHostError(parsed);
  }

  if (parsed.pathname !== apolloPath) {
    throw new InvalidPathError(parsed);
  }

  return parsed.searchParams;
}

export function getStringArg(params: URLSearchParams, name: string): string {
  const values = params.getAll(name);

  if (values.length === 0) {
    throw new ApolloQueryArgsError(
      params,
      `Argument ${name} not found from the query parameters: ${params}`,
    );
  }

  if (values.length > 1) {
    throw new ApolloQueryArgsError(
      params,
      `Argument ${name} specified more than once in the query parameters: ${params}`,
    );
  }

  return values[0];
}

export function getIntArg(params: URLSearchParams, name: string): number {
  const value = getStringArg(params, name);

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed)) {
    throw new ApolloQueryArgsError(
      params,
      `Expected argument ${name} to be an safe Integer but it was: ${parsed}`,
    );
  }

  return parsed;
}
