import { NoEarlierVersionExists } from '../../common/ChangeHistory';
import { BaseTiamatChangeHistoryItem } from '../types';

export function findPreviousTiamatHistoryItemVersion<
  ItemT extends BaseTiamatChangeHistoryItem,
>(
  historyItemsSortedByVersion: ReadonlyArray<ItemT>,
  item: ItemT,
): ItemT | typeof NoEarlierVersionExists {
  const itemVersionNumber = Number(item.version);

  const previous = historyItemsSortedByVersion.find(
    (other) =>
      other.netexId === item.netexId &&
      Number(other.version) < itemVersionNumber,
  );

  return previous ?? NoEarlierVersionExists;
}
