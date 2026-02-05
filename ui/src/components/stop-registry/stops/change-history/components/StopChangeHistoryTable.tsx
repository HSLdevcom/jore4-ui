import { FC } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { useGetUserNames } from '../../../../../hooks';
import { ChangeHistoryTable } from '../../../../common/ChangeHistory';
import { StopChangeHistoryItem } from './StopChangeHistoryItem';

function findPreviousVersion(
  historyItems: ReadonlyArray<QuayChangeHistoryItem>,
  item: QuayChangeHistoryItem,
): QuayChangeHistoryItem | null {
  const assumedPreviousVersion = String(Number(item.version) - 1);
  return (
    historyItems.find(
      (other) =>
        other.netexId === item.netexId &&
        other.version === assumedPreviousVersion,
    ) ?? null
  );
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

  return (
    <ChangeHistoryTable className={className}>
      {historyItems.map((historyItem) => (
        <StopChangeHistoryItem
          key={`${historyItem.netexId}-${historyItem.version}`}
          getUserNameById={getUserNameById}
          historyItem={historyItem}
          previousHistoryItem={findPreviousVersion(historyItems, historyItem)}
        />
      ))}
    </ChangeHistoryTable>
  );
};
