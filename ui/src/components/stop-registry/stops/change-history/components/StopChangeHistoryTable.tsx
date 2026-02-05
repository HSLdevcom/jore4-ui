import { FC, useMemo } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { useGetUserNames } from '../../../../../hooks';
import { ChangeHistoryTable } from '../../../../common/ChangeHistory';
import { StopChangeHistoryItem } from './StopChangeHistoryItem';

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

type StopChangeHistoryTableProps = {
  readonly className?: string;
  readonly historyItems: ReadonlyArray<QuayChangeHistoryItem>;
};

export const StopChangeHistoryTable: FC<StopChangeHistoryTableProps> = ({
  className,
  historyItems,
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

  return (
    <ChangeHistoryTable className={className}>
      {historyItems.map((historyItem) => (
        <StopChangeHistoryItem
          key={`${historyItem.netexId}-${historyItem.version}`}
          getUserNameById={getUserNameById}
          historyItem={historyItem}
          previousHistoryItem={findPreviousVersion(
            historyItemsSortedByVersion,
            historyItem,
          )}
        />
      ))}
    </ChangeHistoryTable>
  );
};
