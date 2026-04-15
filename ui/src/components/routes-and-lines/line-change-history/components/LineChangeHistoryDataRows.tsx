import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { PagingInfo } from '../../../../types';
import { NoEarlierVersionExists } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, PreviousLineChangeHistoryItem } from '../types';
import { LineChangeHistoryItemSections } from './LineChangeHistoryItem';

const testIds = {
  group: (id: string) => `ChangeHistory::Group::${id}`,
};

function findPreviousVersion(
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

type LineChangeHistoryDataRowsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItems: ReadonlyArray<LineChangeHistoryItem>;
  readonly sortedHistoryItems: ReadonlyArray<LineChangeHistoryItem>;
  readonly pagingInfo: PagingInfo;
};

export const LineChangeHistoryDataRows: FC<LineChangeHistoryDataRowsProps> = ({
  getUserNameById,
  historyItems,
  sortedHistoryItems,
  pagingInfo: { page, pageSize },
}) => {
  const pagedItems = sortedHistoryItems.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return pagedItems.map((historyItem) => (
    <tbody
      key={historyItem.id}
      data-testid={testIds.group(
        `${historyItem.lineId}-${historyItem.routeId}-${historyItem.changed.valueOf()}`,
      )}
      data-line-label={historyItem.lineLabel}
      data-route-label={historyItem.routeLabel}
      className="group"
    >
      <LineChangeHistoryItemSections
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previousHistoryItem={findPreviousVersion(historyItems, historyItem)}
      />
    </tbody>
  ));
};
