import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { useGetUserNames } from '../../../../../hooks';
import { PagingInfo } from '../../../../../types';
import {
  ChangeHistorySortingInfo,
  ChangeHistoryTable,
} from '../../../../common/ChangeHistory';
import { StopChangeHistoryFilters } from '../types';
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
  readonly filters: StopChangeHistoryFilters;
  readonly historyItems: ReadonlyArray<QuayChangeHistoryItem>;
  readonly pagingInfo: PagingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<ChangeHistorySortingInfo>>;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

export const StopChangeHistoryTable: FC<StopChangeHistoryTableProps> = ({
  className,
  filters: { from, to },
  historyItems,
  pagingInfo: { page, pageSize },
  setSortingInfo,
  sortingInfo,
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

  return (
    <ChangeHistoryTable
      className={className}
      setSortingInfo={setSortingInfo}
      sortingInfo={sortingInfo}
    >
      {itemsToShow.map((historyItem) => (
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
