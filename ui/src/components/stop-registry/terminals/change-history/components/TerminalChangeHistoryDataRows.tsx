import { FC } from 'react';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { PagingInfo } from '../../../../../types';
import { findPreviousTiamatHistoryItemVersion } from '../../../utils';
import { TerminalChangeHistoryItemSections } from './TerminalChangeHistoryItemSections';

const testIds = {
  group: (id: string) => `ChangeHistory::Group::${id}`,
};

type TerminalChangeHistoryDataRowsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItems: ReadonlyArray<StopPlaceChangeHistoryItem>;
  readonly sortedHistoryItems: ReadonlyArray<StopPlaceChangeHistoryItem>;
  readonly pagingInfo: PagingInfo;
};

export const TerminalChangeHistoryDataRows: FC<
  TerminalChangeHistoryDataRowsProps
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
        <TerminalChangeHistoryItemSections
          getUserNameById={getUserNameById}
          historyItem={historyItem}
          previousHistoryItem={findPreviousTiamatHistoryItemVersion(
            historyItems,
            historyItem,
          )}
        />
      </tbody>
    );
  });
};
