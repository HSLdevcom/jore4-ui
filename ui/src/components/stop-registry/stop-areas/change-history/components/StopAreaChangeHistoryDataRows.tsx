import { FC } from 'react';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { PagingInfo } from '../../../../../types';
import {
  NoEarlierVersionExists,
  PreviousStopPlaceChangeHistoryItem,
} from '../../../../common/ChangeHistory';
import { StopAreaChangeHistoryItemSections } from './StopAreaChangeHistoryItemSections';

const testIds = {
  group: (id: string) => `ChangeHistory::Group::${id}`,
};

export function findPreviousVersion(
  historyItemsSortedByVersion: ReadonlyArray<StopPlaceChangeHistoryItem>,
  item: StopPlaceChangeHistoryItem,
): PreviousStopPlaceChangeHistoryItem {
  const previous = historyItemsSortedByVersion.find(
    (other) =>
      other.netexId === item.netexId &&
      Number(other.version) < Number(item.version),
  );

  return previous ?? NoEarlierVersionExists;
}

type StopPlaceChangeHistoryDataRowsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItems: ReadonlyArray<StopPlaceChangeHistoryItem>;
  readonly sortedHistoryItems: ReadonlyArray<StopPlaceChangeHistoryItem>;
  readonly pagingInfo: PagingInfo;
};

export const StopPlaceChangeHistoryDataRows: FC<
  StopPlaceChangeHistoryDataRowsProps
> = ({
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
        <StopAreaChangeHistoryItemSections
          getUserNameById={getUserNameById}
          historyItem={historyItem}
          previousHistoryItem={findPreviousVersion(historyItems, historyItem)}
        />
      </tbody>
    );
  });
};
