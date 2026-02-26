import { FC, useMemo } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { useGetUserNames } from '../../../../../hooks';
import { PagingInfo } from '../../../../../types';
import { StopChangeHistoryFilters } from '../types';
import { StopChangeHistoryItem } from './StopChangeHistoryItem';

const testIds = {
  group: (id: string) => `ChangeHistory::Group::${id}`,
};

/**
 * Extract the numeric sequence number from a Netex ID.
 * @param netexId
 */
function sequenceNumber(netexId: string): number {
  return Number(netexId.split(':').at(2));
}

function findPreviousVersion(
  historyItemsSortedByVersion: ReadonlyArray<QuayChangeHistoryItem>,
  item: QuayChangeHistoryItem,
): QuayChangeHistoryItem | null {
  const index = historyItemsSortedByVersion.indexOf(item);

  // IndexOf should always find a valid index.
  // But index of 0 is the first item, thus there is no previous version.
  if (index <= 0) {
    return null;
  }

  return historyItemsSortedByVersion[index - 1];
}

type StopChangeHistoryDataRowsProps = {
  readonly filters: StopChangeHistoryFilters;
  readonly historyItems: ReadonlyArray<QuayChangeHistoryItem>;
  readonly pagingInfo: PagingInfo;
};

export const StopChangeHistoryDataRows: FC<StopChangeHistoryDataRowsProps> = ({
  filters: { from, to },
  historyItems,
  pagingInfo: { page, pageSize },
}) => {
  const { getUserNameById } = useGetUserNames();

  // Item data sorted on actual version info.
  // Needed to determine previous version.
  const historyItemsSortedByVersion = useMemo(
    () =>
      historyItems.toSorted((a, b) => {
        if (a.netexId === b.netexId) {
          return Number(a.version) - Number(b.version);
        }

        return sequenceNumber(a.netexId) - sequenceNumber(b.netexId);
      }),
    [historyItems],
  );

  // historyItems can contain extra versions needed to ćonstruct the diffs,
  // even tough the version itself, should not be shown based on the time
  // filters.
  const itemsToShow = useMemo(() => {
    const fromStr = from.toISO();
    const toStr = to.toISO();

    return historyItems
      .filter(({ changed }) => fromStr <= changed && changed <= toStr)
      .slice((page - 1) * pageSize, page * pageSize);
  }, [historyItems, from, to, page, pageSize]);

  return itemsToShow.map((historyItem) => (
    <tbody
      data-testid={testIds.group(
        `${historyItem.netexId}-${historyItem.version}`,
      )}
      className="group"
    >
      <StopChangeHistoryItem
        key={`${historyItem.netexId}-${historyItem.version}`}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        previousHistoryItem={findPreviousVersion(
          historyItemsSortedByVersion,
          historyItem,
        )}
      />
    </tbody>
  ));
};
