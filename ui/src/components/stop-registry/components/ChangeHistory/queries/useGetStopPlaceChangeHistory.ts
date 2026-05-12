import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  StopPlaceChangeHistoryItem,
  useGetStopPlaceChangeHistoryQuery,
} from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { SortOrder } from '../../../../../types';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
} from '../../../../common/ChangeHistory';
import { sortByVersion, useSortTiamatHistoryItems } from '../../../utils';
import { sortByChangedTime } from '../../../utils/sortTiamatChangeHistoryItems';

const GQL_GET_STOP_PLACE_CHANGE_HISTORY_QUERY = gql`
  query getStopPlaceChangeHistory($privateCode: String!) {
    stopsDb: stops_database {
      historyItems: getStopPlaceChangeHistory(
        where: { privateCodeValue: { _eq: $privateCode } }
      ) {
        ...StopPlaceChangeHistoryItemDetails
      }
    }
  }

  fragment StopPlaceChangeHistoryItemDetails on StopPlaceChangeHistoryItem {
    netexId
    version

    changed
    changedBy
    versionComment

    # Used to determine whether the StopPlace was imported from JORE3 or created in JORE4.
    privateCodeType
    privateCodeValue

    validityStart
    validityEnd
    priority

    parentStopPlace
  }
`;

type GetStopPlaceChangeHistoryOptions = {
  readonly filters: ChangeHistoryFilters;
  readonly getUserNameById: GetUserNameById;
  readonly privateCode: string;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

function useGetStopPlaceChangeHistoryItemsSortedByVersion(privateCode: string) {
  const { data, ...rest } = useGetStopPlaceChangeHistoryQuery({
    variables: { privateCode },
  });

  const rawHistoryItems = data?.stopsDb?.historyItems;
  const historyItems: ReadonlyArray<StopPlaceChangeHistoryItem> = useMemo(
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

export function useGetStopPlaceChangeHistory({
  filters,
  getUserNameById,
  privateCode,
  sortingInfo,
}: GetStopPlaceChangeHistoryOptions) {
  const base = useGetStopPlaceChangeHistoryItemsSortedByVersion(privateCode);
  return {
    ...base,
    sortedHistoryItems: useSortTiamatHistoryItems(
      base.historyItems,
      filters,
      sortingInfo,
      getUserNameById,
    ),
  };
}

const latestChangesLimit = 3;
const compareByChangedTime = sortByChangedTime(SortOrder.DESCENDING);

export function useGetLatestStopPlaceChangeHistory(privateCode: string) {
  const base = useGetStopPlaceChangeHistoryItemsSortedByVersion(privateCode);
  return {
    ...base,
    latestHistoryItems: useMemo(
      () =>
        base.historyItems
          .toSorted(compareByChangedTime)
          .slice(0, latestChangesLimit),
      [base.historyItems],
    ),
  };
}
