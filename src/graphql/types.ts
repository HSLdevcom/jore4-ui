import { ApolloQueryResult, QueryResult } from '@apollo/client';
import { DateTime } from 'luxon';

export type GqlQueryResultData = { __typename?: 'query_root' };
export type GqlMutationResultData = { __typename?: 'mutation_root' };

export type GqlQueryResult<TData extends GqlQueryResultData> = Pick<
  | QueryResult<TData> // from useQuery
  | ApolloQueryResult<TData>, // from apolloClient.query
  'data'
>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type StoreType<T extends object> = {
  [Property in keyof T]: T[Property] extends DateTime ? string : T[Property];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function mapToStoreType<T extends object>(
  input: T,
  replaceFields: (keyof T)[],
): StoreType<T> {
  return Object.keys(input).reduce((result, objectKey) => {
    const key = objectKey as keyof T;

    return {
      ...result,
      [key]:
        replaceFields.includes(key) && input[key]
          ? (input[key] as unknown as DateTime)?.toISO()
          : input[key],
    };
  }, {}) as StoreType<T>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function mapFromStoreType<T extends object>(
  input: StoreType<T>,
  replaceFields: (keyof T)[],
): T {
  return Object.keys(input).reduce((result, objectKey) => {
    const key = objectKey as keyof StoreType<T>;

    return {
      ...result,
      [key]:
        replaceFields.includes(key) && input[key]
          ? DateTime.fromISO(input[key] as string)
          : input[key],
    };
  }, {}) as T;
}
