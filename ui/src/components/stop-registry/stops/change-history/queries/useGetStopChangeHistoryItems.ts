import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  QuayChangeHistoryItem,
  useGetStopChangeHistoryQuery,
} from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
} from '../../../../common/ChangeHistory';
import { sortByVersion, useSortTiamatHistoryItems } from '../../../utils';

const GQL_GET_STOP_CHANGE_HISTORY = gql`
  query GetStopChangeHistory($publicCode: String!, $priority: String!) {
    stopsDb: stops_database {
      historyItems: getQuayChangeHistory(
        where: {
          _and: [
            { publicCode: { _eq: $publicCode } }
            { priority: { _eq: $priority } }
          ]
        }
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

export function useGetStopChangeHistoryItems({
  filters,
  getUserNameById,
  publicCode,
  sortingInfo,
}: GetStopChangeHistoryOptions) {
  const { data, ...rest } = useGetStopChangeHistoryQuery({
    variables: { publicCode, priority: String(filters.priority) },
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

  const sortedHistoryItems: ReadonlyArray<QuayChangeHistoryItem> =
    useSortTiamatHistoryItems(
      historyItems,
      filters,
      sortingInfo,
      getUserNameById,
    );

  return { ...rest, historyItems, sortedHistoryItems };
}
