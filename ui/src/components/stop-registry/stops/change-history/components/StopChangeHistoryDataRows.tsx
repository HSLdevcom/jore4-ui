import { FC } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { parseDate } from '../../../../../time';
import { PagingInfo } from '../../../../../types';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';
import { PreviousQuayChangeHistoryItem } from '../types';
import { StopChangeHistoryItem } from './StopChangeHistoryItem';

const testIds = {
  group: (id: string) => `ChangeHistory::Group::${id}`,
};

function findPreviousInstance(
  historyItemsSortedByVersion: ReadonlyArray<QuayChangeHistoryItem>,
  item: QuayChangeHistoryItem,
): PreviousQuayChangeHistoryItem {
  // Special case: Moved from one StopPlace to another.
  // Under hood Tiamat sometimes creates a new version.
  const importedIdIfMoved = `${item.publicCode}-${item.validityStart}-${item.priority}`;

  if (item.importedId === importedIdIfMoved) {
    const previousInstanceEndData = parseDate(item.validityStart)
      ?.minus({ day: 1 })
      ?.toISODate();

    if (previousInstanceEndData) {
      const previousInstance = historyItemsSortedByVersion.find(
        (other) => other.validityEnd === previousInstanceEndData,
      );

      if (previousInstance) {
        return previousInstance;
      }
    }
  }

  return NoEarlierVersionExists;
}

function findPreviousVersion(
  historyItemsSortedByVersion: ReadonlyArray<QuayChangeHistoryItem>,
  item: QuayChangeHistoryItem,
): PreviousQuayChangeHistoryItem {
  const previousVersion = historyItemsSortedByVersion.find(
    (other) =>
      other.netexId === item.netexId &&
      Number(other.version) < Number(item.version),
  );

  if (previousVersion) {
    return previousVersion;
  }

  return findPreviousInstance(historyItemsSortedByVersion, item);
}

type StopChangeHistoryDataRowsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItems: ReadonlyArray<QuayChangeHistoryItem>;
  readonly sortedHistoryItems: ReadonlyArray<QuayChangeHistoryItem>;
  readonly pagingInfo: PagingInfo;
};

export const StopChangeHistoryDataRows: FC<StopChangeHistoryDataRowsProps> = ({
  getUserNameById,
  historyItems,
  sortedHistoryItems,
  pagingInfo: { page, pageSize },
}) => {
  const pagedItems = sortedHistoryItems.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return pagedItems.map((historyItem) => {
    const key = `${historyItem.netexId}-${historyItem.version}`;

    return (
      <tbody
        key={key}
        data-testid={testIds.group(key)}
        data-netexid={historyItem.netexId}
        data-version={historyItem.version}
        className="group"
      >
        <StopChangeHistoryItem
          getUserNameById={getUserNameById}
          historyItem={historyItem}
          previousHistoryItem={findPreviousVersion(historyItems, historyItem)}
        />
      </tbody>
    );
  });
};
