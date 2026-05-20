import { NoEarlierVersionExists } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, PreviousLineChangeHistoryItem } from '../types';

export function findPreviousLineHistoryItemVersion(
  historyItemsSortedByVersion: ReadonlyArray<LineChangeHistoryItem>,
  item: LineChangeHistoryItem,
): PreviousLineChangeHistoryItem {
  if (item.tgOperation === 'INSERT') {
    return NoEarlierVersionExists;
  }

  const previous = historyItemsSortedByVersion.find(
    (other) =>
      other.id < item.id &&
      other.lineId === item.lineId &&
      other.routeId === item.routeId,
  );

  if (previous) {
    return previous;
  }

  throw new Error('Unable to find previous version!');
}
