import { gql } from '@apollo/client';
import identity from 'lodash/identity';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChangeHistoryItemDetailsFragment,
  useGetLineChangeHistoryQuery,
} from '../../../../generated/graphql';
import { GetUserNameById } from '../../../../hooks';
import { SortOrder } from '../../../../types';
import {
  ChangeHistoryFilters,
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, TgOperation } from '../types';

const GQL_GET_LINE_CHANGE_HISTORY = gql`
  query GetLineChangeHistory(
    $label: String!
    $from: timestamptz!
    $to: timestamptz!
    $priority: Int!
  ) {
    historyItems: route_line_change_history(
      where: {
        _and: [
          { line_label: { _eq: $label } }
          { line_priority: { _eq: $priority } }
          { changed: { _gte: $from } }
          { changed: { _lte: $to } }
        ]
      }
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
    tgOperation: raw.tgOperation as TgOperation,
    validityStart: raw.routeId ? raw.routeValidityStart : raw.lineValidityStart,
    validityEnd: raw.routeId ? raw.routeValidityEnd : raw.lineValidityEnd,
  };
}

type NullOrder = 'NullsFirst' | 'NullsLast';
type Comparator = (
  a: LineChangeHistoryItem,
  b: LineChangeHistoryItem,
) => number;
type Order = (comparator: Comparator) => Comparator;

function getOrder(sortOrder: SortOrder): Order {
  if (sortOrder === SortOrder.ASCENDING) {
    return identity;
  }

  return (comparator) => (a, b) => -1 * comparator(a, b);
}

function compareValues<ValueT>(
  rawA: ValueT,
  rawB: ValueT,
  compareNonNullable: (
    a: NonNullable<ValueT>,
    b: NonNullable<ValueT>,
  ) => number,
  nullOrder: NullOrder = 'NullsLast',
): number {
  const a = rawA ?? null;
  const b = rawB ?? null;

  if (a !== null && b !== null) {
    return compareNonNullable(a, b);
  }

  if (a === null && b !== null) {
    return nullOrder === 'NullsLast'
      ? Number.NEGATIVE_INFINITY
      : Number.POSITIVE_INFINITY;
  }

  if (b === null && a !== null) {
    return nullOrder === 'NullsLast'
      ? Number.POSITIVE_INFINITY
      : Number.NEGATIVE_INFINITY;
  }

  return 0;
}

function chainedComparator(
  ...comparators: ReadonlyArray<Comparator>
): Comparator {
  return (a, b) => {
    let result = 0;

    for (const comparator of comparators) {
      result = comparator(a, b);
      if (result !== 0) {
        return result;
      }
    }

    return result;
  };
}

function diffDateTime(a: DateTime, b: DateTime) {
  return a.valueOf() - b.valueOf();
}

function byChanged(): Comparator {
  return (a, b) => compareValues(a.changed, b.changed, diffDateTime);
}

function byValidityStart(): Comparator {
  return (a, b) =>
    compareValues(a.validityStart, b.validityStart, diffDateTime);
}

function byValidityEnd(): Comparator {
  return (a, b) => compareValues(a.validityEnd, b.validityEnd, diffDateTime);
}

function byDbId(): Comparator {
  return (a, b) => Number(a.id) - Number(b.id);
}

function byChanger(
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator {
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
): Comparator {
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
): Comparator {
  return (a, b) =>
    compareValues(
      a.routeLabel,
      b.routeLabel,
      collator.compare.bind(collator),
      nullOrder,
    );
}

function sortByChangedTime(sortOrder: SortOrder): Comparator {
  const order = getOrder(sortOrder);
  return chainedComparator(order(byChanged()), order(byDbId()));
}

function sortByChanger(
  sortOrder: SortOrder,
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator {
  const order = getOrder(sortOrder);
  return chainedComparator(
    order(byChanger(collator, getUserNameById)),
    order(byChanged()),
    order(byDbId()),
  );
}

function sortByValidityStart(
  sortOrder: SortOrder,
  collator: Intl.Collator,
): Comparator {
  const order = getOrder(sortOrder);
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
): Comparator {
  const order = getOrder(sortOrder);
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
): Comparator {
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

function byLineId(): Comparator {
  return (a, b) => compareValues(a.lineId, b.lineId, compareUUIDs);
}

function byRouteId(): Comparator {
  return (a, b) =>
    compareValues(a.routeId, b.routeId, compareUUIDs, 'NullsFirst');
}

function sortByVersion(): Comparator {
  const inDescendingOrder = getOrder(SortOrder.DESCENDING);
  return chainedComparator(
    byLineId(),
    byRouteId(),
    inDescendingOrder(byChanged()),
    inDescendingOrder(byDbId()),
  );
}

const noopGetUserNameById: GetUserNameById = () => null;

function useSortHistoryItems(
  historyItems: ReadonlyArray<LineChangeHistoryItem>,
  sortingInfo: ChangeHistorySortingInfo,
  getUserNameByIdRealImpl: GetUserNameById,
): ReadonlyArray<LineChangeHistoryItem> {
  const { t } = useTranslation();
  const langCode = t(($) => $.languages.intlLangCode);
  const collator = useMemo(
    () => new Intl.Collator(langCode, { numeric: true }),
    [langCode],
  );

  // Most sorting setups do not need to access the mapped username.
  // Thus, we do not need to react to changes in them.
  const getUserNameById: GetUserNameById =
    sortingInfo.sortBy === SortChangeHistoryBy.ChangedBy
      ? getUserNameByIdRealImpl
      : noopGetUserNameById;

  return useMemo(
    () =>
      historyItems.toSorted(
        sortBySortingInfo(sortingInfo, collator, getUserNameById),
      ),
    [historyItems, sortingInfo, collator, getUserNameById],
  );
}

type GetLineChangeHistoryOptions = {
  readonly filters: ChangeHistoryFilters;
  readonly getUserNameById: GetUserNameById;
  readonly label: string;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

export function useGetLineChangeHistoryItems({
  filters: { from, to, priority },
  getUserNameById,
  label,
  sortingInfo,
}: GetLineChangeHistoryOptions) {
  const { data, ...rest } = useGetLineChangeHistoryQuery({
    variables: {
      label,
      priority,
      from: from.startOf('day'),
      to: to.endOf('day'),
    },
  });

  const historyItems: ReadonlyArray<LineChangeHistoryItem> = useMemo(
    () =>
      (data?.historyItems ?? [])
        .map(parseRawLineChangeHistoryItem)
        .sort(sortByVersion()),
    [data],
  );

  const sortedHistoryItems: ReadonlyArray<LineChangeHistoryItem> =
    useSortHistoryItems(historyItems, sortingInfo, getUserNameById);

  return {
    ...rest,
    historyItems,
    sortedHistoryItems,
  };
}
