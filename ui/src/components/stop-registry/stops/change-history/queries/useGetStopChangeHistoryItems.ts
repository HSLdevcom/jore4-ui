import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  QuayChangeHistoryItem,
  useGetStopChangeHistoryQuery,
} from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { SortOrder } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
} from '../../../../common/ChangeHistory';
import {
  historyItemIsDateRange,
  sortByVersion,
  useSortTiamatHistoryItems,
} from '../../../utils';
import { sortByChangedTime } from '../../../utils/sortTiamatChangeHistoryItems';

const GQL_GET_STOP_CHANGE_HISTORY = gql`
  query GetStopChangeHistory($publicCode: String!) {
    stopsDb: stops_database {
      historyItems: getQuayChangeHistory(
        where: { publicCode: { _eq: $publicCode } }
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

type GetStopChangeHistoryOptions = {
  readonly filters: ChangeHistoryFilters;
  readonly getUserNameById: GetUserNameById;
  readonly sortingInfo: ChangeHistorySortingInfo;
  readonly publicCode: string;
};

function useGetStopChangeHistorySortedByVersion(publicCode: string) {
  const { data, ...rest } = useGetStopChangeHistoryQuery({
    variables: { publicCode },
  });

  const rawHistoryItems = data?.stopsDb?.historyItems;
  const historyItems: ReadonlyArray<QuayChangeHistoryItem> = useMemo(
    () =>
      compact(rawHistoryItems)
        .map((item) => ({
          ...item,
          versionComment: item.versionComment?.trim(),
        }))
        .sort(sortByVersion()),
    [rawHistoryItems],
  );

  return { ...rest, historyItems };
}

function filterQuayHistoryItems(
  filters: ChangeHistoryFilters,
): (item: QuayChangeHistoryItem) => boolean {
  const priorityStr = String(filters.priority);
  const isInDateRange = historyItemIsDateRange(filters);

  return (item) => item.priority === priorityStr && isInDateRange(item);
}

export function useGetStopChangeHistoryItems({
  filters,
  getUserNameById,
  publicCode,
  sortingInfo,
}: GetStopChangeHistoryOptions) {
  const base = useGetStopChangeHistorySortedByVersion(publicCode);

  const sortedHistoryItems: ReadonlyArray<QuayChangeHistoryItem> =
    useSortTiamatHistoryItems(
      base.historyItems,
      filters,
      sortingInfo,
      getUserNameById,
      filterQuayHistoryItems,
    );

  return { ...base, sortedHistoryItems };
}

const latestChangesLimit = 3;

export function useGetLatestStopChangeHistory(
  publicCode: string,
  priority: Priority,
) {
  const priorityStr = String(priority);
  const base = useGetStopChangeHistorySortedByVersion(publicCode);

  return {
    ...base,
    latestHistoryItems: useMemo(
      () =>
        base.historyItems
          .filter((it) => it.priority === priorityStr)
          .toSorted(sortByChangedTime(SortOrder.DESCENDING))
          .slice(0, latestChangesLimit),
      [base.historyItems, priorityStr],
    ),
  };
}
