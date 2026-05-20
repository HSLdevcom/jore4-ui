import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  LineChangeHistoryItemDetailsFragment,
  useGetLineChangeHistoryQuery,
} from '../../../../generated/graphql';
import { GetUserNameById } from '../../../../hooks';
import { SortOrder } from '../../../../types';
import {
  Comparator,
  NullOrder,
  chainedComparator,
  compareValues,
  getOrder,
  useCollator,
} from '../../../../utils';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, TgOperation } from '../types';

const GQL_GET_LINE_CHANGE_HISTORY = gql`
  query GetLineChangeHistory($label: String!) {
    historyItems: route_line_change_history(
      where: { line_label: { _eq: $label } }
    ) {
      ...LineChangeHistoryItemDetails
    }
  }

  fragment LineChangeHistoryItemDetails on route_line_change_history {
    id

    tgOperation: tg_operation

    lineId: line_id
    lineLabel: line_label
    linePriority: line_priority
    lineValidityStart: line_validity_start
    lineValidityEnd: line_validity_end

    routeId: route_id
    routeLabel: route_label
    routeDirection: route_direction
    routeValidityStart: route_validity_start
    routeValidityEnd: route_validity_end

    name
    versionComment: version_comment

    changed
    changedBy: changed_by
  }
`;

function parseRawLineChangeHistoryItem(
  raw: LineChangeHistoryItemDetailsFragment,
): LineChangeHistoryItem {
  return {
    ...raw,
    versionComment: raw.versionComment?.trim() ?? null,
    tgOperation: raw.tgOperation as TgOperation,
    validityStart: raw.routeId ? raw.routeValidityStart : raw.lineValidityStart,
    validityEnd: raw.routeId ? raw.routeValidityEnd : raw.lineValidityEnd,
  };
}

function diffDateTime(a: DateTime, b: DateTime) {
  return a.valueOf() - b.valueOf();
}

function byChanged(): Comparator<LineChangeHistoryItem> {
  return (a, b) => compareValues(a.changed, b.changed, diffDateTime);
}

function byValidityStart(): Comparator<LineChangeHistoryItem> {
  return (a, b) =>
    compareValues(a.validityStart, b.validityStart, diffDateTime);
}

function byValidityEnd(): Comparator<LineChangeHistoryItem> {
  return (a, b) => compareValues(a.validityEnd, b.validityEnd, diffDateTime);
}

function byDbId(): Comparator<LineChangeHistoryItem> {
  return (a, b) => Number(a.id) - Number(b.id);
}

function byChanger(
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<LineChangeHistoryItem> {
  return (a, b) =>
    compareValues(
      getUserNameById(a.changedBy) ?? a.changedBy ?? 'HSL',
      getUserNameById(b.changedBy) ?? b.changedBy ?? 'HSL',
      collator.compare.bind(collator),
    );
}

function byLineLabel(
  collator: Intl.Collator,
  nullOrder?: NullOrder,
): Comparator<LineChangeHistoryItem> {
  return (a, b) =>
    compareValues(
      a.lineLabel,
      b.lineLabel,
      collator.compare.bind(collator),
      nullOrder,
    );
}

function byRouteLabel(
  collator: Intl.Collator,
  nullOrder?: NullOrder,
): Comparator<LineChangeHistoryItem> {
  return (a, b) =>
    compareValues(
      a.routeLabel,
      b.routeLabel,
      collator.compare.bind(collator),
      nullOrder,
    );
}

function sortByChangedTime(
  sortOrder: SortOrder,
): Comparator<LineChangeHistoryItem> {
  const order = getOrder<LineChangeHistoryItem>(sortOrder);
  return chainedComparator(order(byChanged()), order(byDbId()));
}

function sortByChanger(
  sortOrder: SortOrder,
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<LineChangeHistoryItem> {
  const order = getOrder<LineChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byChanger(collator, getUserNameById)),
    order(byChanged()),
    order(byDbId()),
  );
}

function sortByValidityStart(
  sortOrder: SortOrder,
  collator: Intl.Collator,
): Comparator<LineChangeHistoryItem> {
  const order = getOrder<LineChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byValidityStart()),
    order(byLineLabel(collator)),
    order(byRouteLabel(collator)),
    order(byChanged()),
    order(byDbId()),
  );
}

function sortByValidityEnd(
  sortOrder: SortOrder,
  collator: Intl.Collator,
): Comparator<LineChangeHistoryItem> {
  const order = getOrder<LineChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byValidityEnd()),
    order(byLineLabel(collator)),
    order(byRouteLabel(collator)),
    order(byChanged()),
    order(byDbId()),
  );
}

function sortBySortingInfo(
  { sortBy, sortOrder }: ChangeHistorySortingInfo,
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<LineChangeHistoryItem> {
  switch (sortBy) {
    case SortChangeHistoryBy.Changed:
      return sortByChangedTime(sortOrder);

    case SortChangeHistoryBy.ChangedBy:
      return sortByChanger(sortOrder, collator, getUserNameById);

    case SortChangeHistoryBy.ValidityStart:
      return sortByValidityStart(sortOrder, collator);

    case SortChangeHistoryBy.ValidityEnd:
      return sortByValidityEnd(sortOrder, collator);

    default:
      return () => 0;
  }
}

function compareUUIDs(a: UUID, b: UUID) {
  if (a < b) {
    return -1;
  }

  if (a === b) {
    return 0;
  }

  return 1;
}

function byLineId(): Comparator<LineChangeHistoryItem> {
  return (a, b) => compareValues(a.lineId, b.lineId, compareUUIDs);
}

function byRouteId(): Comparator<LineChangeHistoryItem> {
  return (a, b) =>
    compareValues(a.routeId, b.routeId, compareUUIDs, 'NullsFirst');
}

function sortByVersion(): Comparator<LineChangeHistoryItem> {
  const inDescendingOrder = getOrder<LineChangeHistoryItem>(
    SortOrder.DESCENDING,
  );
  return chainedComparator(
    byLineId(),
    byRouteId(),
    inDescendingOrder(byChanged()),
    inDescendingOrder(byDbId()),
  );
}

function filterHistoryItems(
  filters: ChangeHistoryFilters,
): (item: LineChangeHistoryItem) => boolean {
  const from = filters.from.startOf('day');
  const to = filters.to.endOf('day');
  const { priority } = filters;

  return (item) =>
    item.linePriority === priority &&
    from <= item.changed &&
    item.changed <= to;
}

const noopGetUserNameById: GetUserNameById = () => null;

function useSortHistoryItems(
  historyItems: ReadonlyArray<LineChangeHistoryItem>,
  filters: ChangeHistoryFilters,
  sortingInfo: ChangeHistorySortingInfo,
  getUserNameByIdRealImpl: GetUserNameById,
): ReadonlyArray<LineChangeHistoryItem> {
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

type GetLineChangeHistoryOptions = {
  readonly filters: ChangeHistoryFilters;
  readonly getUserNameById: GetUserNameById;
  readonly label: string;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

function useGetLineChangeHistoryItemsSortedByVersion(label: string) {
  const { data, ...rest } = useGetLineChangeHistoryQuery({
    variables: { label },
  });

  const historyItems: ReadonlyArray<LineChangeHistoryItem> = useMemo(
    () =>
      (data?.historyItems ?? [])
        .map(parseRawLineChangeHistoryItem)
        .sort(sortByVersion()),
    [data],
  );

  return { ...rest, historyItems };
}

export function useGetLineChangeHistoryItems({
  filters,
  getUserNameById,
  label,
  sortingInfo,
}: GetLineChangeHistoryOptions) {
  const base = useGetLineChangeHistoryItemsSortedByVersion(label);

  const sortedHistoryItems: ReadonlyArray<LineChangeHistoryItem> =
    useSortHistoryItems(
      base.historyItems,
      filters,
      sortingInfo,
      getUserNameById,
    );

  return {
    ...base,
    sortedHistoryItems,
  };
}

const latestChangesLimit = 3;
const compareByChangedTime = sortByChangedTime(SortOrder.DESCENDING);

export function useGetLatestLineChangeHistory(label: string) {
  const base = useGetLineChangeHistoryItemsSortedByVersion(label);
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
