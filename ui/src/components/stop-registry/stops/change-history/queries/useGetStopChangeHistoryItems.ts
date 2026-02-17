import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  OrderBy,
  QuayChangeHistoryItem,
  StopsDatabaseQuayChangeHistoryItemOrderBy,
  useGetStopChangeHistoryQuery,
} from '../../../../../generated/graphql';
import { SortOrder } from '../../../../../types';
import {
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../../../common/ChangeHistory';
import { StopChangeHistoryFilters } from '../types';

const GQL_GET_STOP_CHANGE_HISTORY = gql`
  query GetStopChangeHistory(
    $publicCode: String!
    $from: timestamp!
    $to: timestamp!
    $priority: Int!
    $orderBy: [stops_database_QuayChangeHistoryItem_order_by!]!
  ) {
    stopsDb: stops_database {
      historyItems: getQuayChangeHistory(
        where: {
          _and: [
            { publicCode: { _eq: $publicCode } }
            { priority: { _eq: $priority } }
            { changed: { _gte: $from } }
            { changed: { _lte: $to } }
          ]
        }
        order_by: $orderBy
      ) {
        ...QuayChangeHistoryItemDetails
      }

      extraDiffItem: getQuayChangeHistory(
        where: {
          publicCode: { _eq: $publicCode }
          priority: { _eq: $priority }
          changed: { _lt: $from }
        }
        order_by: [{ changed: desc }]
        limit: 1
      ) {
        ...QuayChangeHistoryItemDetails
      }
    }
  }

  fragment QuayChangeHistoryItemDetails on QuayChangeHistoryItem {
    netexId
    version

    changed
    changedBy
    versionComment

    # Used to determine whether the stop was imported from JORE3 or created in JORE4.
    privateCodeType
    privateCodeValue
    publicCode
    importedId

    validityStart
    validityEnd
    priority

    stopPlaceNetexId
    stopPlaceVersion
  }
`;

function sortingInfoToOrderBy({
  sortBy,
  sortOrder,
}: ChangeHistorySortingInfo): Array<StopsDatabaseQuayChangeHistoryItemOrderBy> {
  const orderBy =
    sortOrder === SortOrder.ASCENDING ? OrderBy.Asc : OrderBy.Desc;
  const byVersion: StopsDatabaseQuayChangeHistoryItemOrderBy = {
    changed: orderBy,
  };

  switch (sortBy) {
    case SortChangeHistoryBy.ValidityStart:
      return [{ validityStart: orderBy }, byVersion];

    case SortChangeHistoryBy.ValidityEnd:
      return [{ validityEnd: orderBy }, byVersion];

    case SortChangeHistoryBy.ChangedBy:
      return [{ changedBy: orderBy }, byVersion];

    case SortChangeHistoryBy.Changed:
    default:
      return [{ changed: orderBy }, byVersion];
  }
}

type GetStopChangeHistoryOptions = {
  readonly filters: StopChangeHistoryFilters;
  readonly sortingInfo: ChangeHistorySortingInfo;
  readonly publicCode: string;
};

export function useGetStopChangeHistoryItems({
  filters: { from, to, priority },
  publicCode,
  sortingInfo,
}: GetStopChangeHistoryOptions) {
  const { data, ...rest } = useGetStopChangeHistoryQuery({
    variables: {
      publicCode,
      priority,
      from: from.startOf('day').toISO(),
      to: to.endOf('day').toISO(),
      orderBy: sortingInfoToOrderBy(sortingInfo),
    },
  });

  const { historyItems: rawHistoryItems, extraDiffItem: rawExtraItem } =
    data?.stopsDb ?? {};
  const historyItems: ReadonlyArray<QuayChangeHistoryItem> = useMemo(
    () =>
      compact(rawHistoryItems)
        .concat(rawExtraItem ?? [])
        .map((item) => ({
          ...item,
          versionComment: item.versionComment?.trim(),
        })),
    [rawHistoryItems, rawExtraItem],
  );

  return { ...rest, historyItems };
}
