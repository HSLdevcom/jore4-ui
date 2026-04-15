import { gql } from '@apollo/client';
import { useGetLineChangeHistoryItemDataQuery } from '../../../../generated/graphql';
import { DataNotFoundError } from '../errors';
import { LineChangeHistoryItem, LineData } from '../types';

const GQL_GET_LINE_CHANGE_HISTORY_ITEM_DATA = gql`
  query GetLineChangeHistoryItemData(
    $where: route_line_change_history_bool_exp!
    $orderBy: [route_line_change_history_order_by!]!
  ) {
    items: route_line_change_history(
      where: $where
      order_by: $orderBy
      limit: 1
    ) {
      id
      data
    }
  }
`;

type QueryParameters = Parameters<
  typeof useGetLineChangeHistoryItemDataQuery
>[0];
type QueryResult = ReturnType<typeof useGetLineChangeHistoryItemDataQuery>;

function getByIdQueryOptions(item: LineChangeHistoryItem): QueryParameters {
  return {
    variables: {
      where: { id: { _eq: item.id } },
      orderBy: [],
    },
  };
}

function getError(
  currentHistoryItem: LineChangeHistoryItem,
  previousHistoryItem: LineChangeHistoryItem,
  currentItemResult: QueryResult,
  previousItemResult: QueryResult,
  currentItemData: LineData | null,
  previousItemData: LineData | null,
): Error | null {
  if (currentItemResult.error && previousItemResult.error) {
    return new AggregateError(
      [currentItemResult.error, previousItemResult.error],
      'Failed to fetch Line Change History data!',
    );
  }

  if (currentItemResult.error) {
    return currentItemResult.error;
  }

  if (previousItemResult.error) {
    return previousItemResult.error;
  }

  if (!currentItemData || !previousItemData) {
    return new DataNotFoundError({
      currentHistoryItem,
      currentItemData,
      previousHistoryItem,
      previousItemData,
    });
  }

  return null;
}

type GetLineChangeHistoryItemDataLoading = {
  readonly loading: true;
  readonly currentItemData?: never;
  readonly previousItemData?: never;
  readonly error?: never;
  readonly refetch?: never;
};

type GetLineChangeHistoryItemDataLoaded = {
  readonly loading: false;
  readonly currentItemData: LineData;
  readonly previousItemData: LineData;
  readonly error?: never;
  readonly refetch?: never;
};

type GetLineChangeHistoryItemDataError = {
  readonly loading: false;
  readonly currentItemData?: never;
  readonly previousItemData?: never;
  readonly error: Error;
  readonly refetch: () => Promise<readonly [unknown, unknown]>;
};

type GetLineChangeHistoryItemDataResult =
  | GetLineChangeHistoryItemDataLoading
  | GetLineChangeHistoryItemDataLoaded
  | GetLineChangeHistoryItemDataError;

export function useGetLineChangeHistoryItemData(
  currentHistoryItem: LineChangeHistoryItem,
  previousHistoryItem: LineChangeHistoryItem,
): GetLineChangeHistoryItemDataResult {
  const currentItemResult = useGetLineChangeHistoryItemDataQuery({
    ...getByIdQueryOptions(currentHistoryItem),
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  const previousItemResult = useGetLineChangeHistoryItemDataQuery({
    ...getByIdQueryOptions(previousHistoryItem),
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  const loading = currentItemResult.loading || previousItemResult.loading;
  if (loading) {
    return { loading: true };
  }

  const currentItemData: LineData | null =
    currentItemResult.data?.items?.at(0)?.data ?? null;

  const previousItemData: LineData | null =
    previousItemResult.data?.items?.at(0)?.data ?? null;

  const error = getError(
    currentHistoryItem,
    previousHistoryItem,
    currentItemResult,
    previousItemResult,
    currentItemData,
    previousItemData,
  );

  if (error) {
    return {
      loading: false,
      error,
      refetch: () =>
        Promise.all([
          currentItemResult.error
            ? currentItemResult.refetch()
            : Promise.resolve(null),
          previousItemResult.error
            ? previousItemResult.refetch()
            : Promise.resolve(null),
        ]),
    };
  }

  return {
    loading: false,
    // getError asserts that currentItemData & previousItemData are not null
    currentItemData: currentItemData as LineData,
    previousItemData: previousItemData as LineData,
  };
}
