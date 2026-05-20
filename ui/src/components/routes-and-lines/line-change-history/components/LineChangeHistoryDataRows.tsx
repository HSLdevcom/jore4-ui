import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { PagingInfo } from '../../../../types';
import { LineChangeHistoryItem } from '../types';
import { findPreviousLineHistoryItemVersion } from '../utils';
import { LineChangeHistoryItemSections } from './LineChangeHistoryItem';

const testIds = {
  group: (id: string) => `ChangeHistory::Group::${id}`,
};

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
        previousHistoryItem={findPreviousLineHistoryItemVersion(
          historyItems,
          historyItem,
        )}
      />
    </tbody>
  ));
};
