import { GetUserNameById } from '../../../hooks';
import { SortOrder } from '../../../types';
import {
  Comparator,
  chainedComparator,
  comparePrimitive,
  compareValues,
  getOrder,
} from '../../../utils';
import {
  ChangeHistorySortingInfo,
  SortChangeHistoryBy,
} from '../../common/ChangeHistory';
import { BaseTiamatChangeHistoryItem } from '../types';

function byNetexId(): Comparator<BaseTiamatChangeHistoryItem> {
  return (a, b) => compareValues(a.netexId, b.netexId, comparePrimitive);
}

function byVersion(): Comparator<BaseTiamatChangeHistoryItem> {
  return (a, b) =>
    compareValues(Number(a.version), Number(b.version), comparePrimitive);
}

function byChanged(): Comparator<BaseTiamatChangeHistoryItem> {
  return (a, b) => compareValues(a.changed, b.changed, comparePrimitive);
}

function byChanger(
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<BaseTiamatChangeHistoryItem> {
  return (a, b) =>
    compareValues(
      getUserNameById(a.changedBy) ?? a.changedBy ?? 'HSL',
      getUserNameById(b.changedBy) ?? b.changedBy ?? 'HSL',
      collator.compare.bind(collator),
    );
}

function byValidityStart(): Comparator<BaseTiamatChangeHistoryItem> {
  return (a, b) =>
    compareValues(a.validityStart, b.validityStart, comparePrimitive);
}

function byValidityEnd(): Comparator<BaseTiamatChangeHistoryItem> {
  return (a, b) =>
    compareValues(a.validityEnd, b.validityEnd, comparePrimitive);
}

export function sortByVersion(): Comparator<BaseTiamatChangeHistoryItem> {
  const inDescendingOrder = getOrder<BaseTiamatChangeHistoryItem>(
    SortOrder.DESCENDING,
  );
  return chainedComparator(byNetexId(), inDescendingOrder(byVersion()));
}

function sortByChangedTime(
  sortOrder: SortOrder,
): Comparator<BaseTiamatChangeHistoryItem> {
  const order = getOrder<BaseTiamatChangeHistoryItem>(sortOrder);
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
): Comparator<BaseTiamatChangeHistoryItem> {
  const order = getOrder<BaseTiamatChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byChanger(collator, getUserNameById)),
    order(byChanged()),
    order(byNetexId()),
    order(byVersion()),
  );
}

function sortByValidityStart(
  sortOrder: SortOrder,
): Comparator<BaseTiamatChangeHistoryItem> {
  const order = getOrder<BaseTiamatChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byValidityStart()),
    order(byChanged()),
    order(byNetexId()),
    order(byVersion()),
  );
}

function sortByValidityEnd(
  sortOrder: SortOrder,
): Comparator<BaseTiamatChangeHistoryItem> {
  const order = getOrder<BaseTiamatChangeHistoryItem>(sortOrder);
  return chainedComparator(
    order(byValidityEnd()),
    order(byChanged()),
    order(byNetexId()),
    order(byVersion()),
  );
}

export function sortBySortingInfo(
  { sortBy, sortOrder }: ChangeHistorySortingInfo,
  collator: Intl.Collator,
  getUserNameById: GetUserNameById,
): Comparator<BaseTiamatChangeHistoryItem> {
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
