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
  Comparator,
  chainedComparator,
  comparePrimitive,
  compareValues,
  getOrder,
  useCollator,
} from '../../../../../utils';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../../../common/ChangeHistory';

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

function byNetexId(): Comparator<StopPlaceChangeHistoryItem> {
  return (a, b) => compareValues(a.netexId, b.netexId, comparePrimitive);
}

function byVersion(): Comparator<StopPlaceChangeHistoryItem> {
  return (a, b) =>
    compareValues(Number(a.version), Number(b.version), comparePrimitive);
}

function byChanged(): Comparator<StopPlaceChangeHistoryItem> {
  return (a, b) => compareValues(a.changed, b.changed, comparePrimitive);
}

function byChanger(
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<StopPlaceChangeHistoryItem> {
  return (a, b) =>
    compareValues(
      getUserNameById(a.changedBy) ?? a.changedBy ?? 'HSL',
      getUserNameById(b.changedBy) ?? b.changedBy ?? 'HSL',
      collator.compare.bind(collator),
    );
}

function byValidityStart(): Comparator<StopPlaceChangeHistoryItem> {
  return (a, b) =>
    compareValues(a.validityStart, b.validityStart, comparePrimitive);
}

function byValidityEnd(): Comparator<StopPlaceChangeHistoryItem> {
  return (a, b) =>
    compareValues(a.validityEnd, b.validityEnd, comparePrimitive);
}

function sortByVersion(): Comparator<StopPlaceChangeHistoryItem> {
  const inDescendingOrder = getOrder<StopPlaceChangeHistoryItem>(
    SortOrder.DESCENDING,
  );
  return chainedComparator(byNetexId(), inDescendingOrder(byVersion()));
}

function sortByChangedTime(
  sortOrder: SortOrder,
): Comparator<StopPlaceChangeHistoryItem> {
  const order = getOrder<StopPlaceChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byChanged()),
    order(byNetexId()),
    order(byVersion()),
  );
}

function sortByChanger(
  sortOrder: SortOrder,
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<StopPlaceChangeHistoryItem> {
  const order = getOrder<StopPlaceChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byChanger(collator, getUserNameById)),
    order(byChanged()),
    order(byNetexId()),
    order(byVersion()),
  );
}

function sortByValidityStart(
  sortOrder: SortOrder,
): Comparator<StopPlaceChangeHistoryItem> {
  const order = getOrder<StopPlaceChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byValidityStart()),
    order(byChanged()),
    order(byNetexId()),
    order(byVersion()),
  );
}

function sortByValidityEnd(
  sortOrder: SortOrder,
): Comparator<StopPlaceChangeHistoryItem> {
  const order = getOrder<StopPlaceChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byValidityEnd()),
    order(byChanged()),
    order(byNetexId()),
    order(byVersion()),
  );
}

function sortBySortingInfo(
  { sortBy, sortOrder }: ChangeHistorySortingInfo,
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<StopPlaceChangeHistoryItem> {
  switch (sortBy) {
    case SortChangeHistoryBy.Changed:
      return sortByChangedTime(sortOrder);

    case SortChangeHistoryBy.ChangedBy:
      return sortByChanger(sortOrder, collator, getUserNameById);

    case SortChangeHistoryBy.ValidityStart:
      return sortByValidityStart(sortOrder);

    case SortChangeHistoryBy.ValidityEnd:
      return sortByValidityEnd(sortOrder);

    default:
      return () => 0;
  }
}

function filterHistoryItems({
  from,
  to,
}: ChangeHistoryFilters): (item: StopPlaceChangeHistoryItem) => boolean {
  const fromStr = from.startOf('day').toUTC().toISO({ includeOffset: false });
  const toStr = to.endOf('day').toUTC().toISO({ includeOffset: false });

  // Changed is a ISO 8601 date-time string and be compared as string.
  return (item) => fromStr <= item.changed && item.changed <= toStr;
}

const noopGetUserNameById: GetUserNameById = () => null;

function useSortHistoryItems(
  historyItems: ReadonlyArray<StopPlaceChangeHistoryItem>,
  filters: ChangeHistoryFilters,
  sortingInfo: ChangeHistorySortingInfo,
  getUserNameByIdRealImpl: GetUserNameById,
): ReadonlyArray<StopPlaceChangeHistoryItem> {
  const collator = useCollator({ numeric: true });

  // Most sorting setups do not need to access the mapped username.
  // Thus, we do not need to react to changes in them.
  const getUserNameById: GetUserNameById =
    sortingInfo.sortBy === SortChangeHistoryBy.ChangedBy
      ? getUserNameByIdRealImpl
      : noopGetUserNameById;

  return useMemo(
    () =>
      historyItems
        .filter(filterHistoryItems(filters))
        .sort(sortBySortingInfo(sortingInfo, collator, getUserNameById)),
    [historyItems, filters, sortingInfo, collator, getUserNameById],
  );
}

type GetStopPlaceChangeHistoryOptions = {
  readonly filters: ChangeHistoryFilters;
  readonly getUserNameById: GetUserNameById;
  readonly privateCode: string;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

export function useGetStopPlaceChangeHistory({
  filters,
  getUserNameById,
  privateCode,
  sortingInfo,
}: GetStopPlaceChangeHistoryOptions) {
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

  const sortedHistoryItems: ReadonlyArray<StopPlaceChangeHistoryItem> =
    useSortHistoryItems(historyItems, filters, sortingInfo, getUserNameById);

  return { ...rest, historyItems, sortedHistoryItems };
}
