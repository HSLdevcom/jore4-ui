import { Dispatch, FC, SetStateAction } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { PagingInfo } from '../../../../../types';
import {
  ChangeHistorySortingInfo,
  ChangeHistoryTable,
  FailedToLoadChangeHistory,
  LoadingChangeHistory,
} from '../../../../common/ChangeHistory';
import { StopChangeHistoryDataRows } from './StopChangeHistoryDataRows';

type StopChangeHistoryTableProps = {
  readonly className?: string;
  readonly error: Error | null;
  readonly getUserNameById: GetUserNameById;
  readonly historyItems: ReadonlyArray<QuayChangeHistoryItem>;
  readonly sortedHistoryItems: ReadonlyArray<QuayChangeHistoryItem>;
  readonly loading: boolean;
  readonly pagingInfo: PagingInfo;
  readonly refetch: () => void;
  readonly setSortingInfo: Dispatch<SetStateAction<ChangeHistorySortingInfo>>;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

export const StopChangeHistoryTable: FC<StopChangeHistoryTableProps> = ({
  className,
  error,
  getUserNameById,
  historyItems,
  sortedHistoryItems,
  loading,
  pagingInfo,
  refetch,
  setSortingInfo,
  sortingInfo,
}) => {
  const showLoader = historyItems.length === 0 && loading;

  return (
    <ChangeHistoryTable
      className={className}
      loading={loading}
      setSortingInfo={setSortingInfo}
      sortingInfo={sortingInfo}
    >
      {error !== null && <FailedToLoadChangeHistory refetch={refetch} />}

      {error === null && showLoader && <LoadingChangeHistory />}

      {error === null && !showLoader && (
        <StopChangeHistoryDataRows
          getUserNameById={getUserNameById}
          historyItems={historyItems}
          sortedHistoryItems={sortedHistoryItems}
          pagingInfo={pagingInfo}
        />
      )}
    </ChangeHistoryTable>
  );
};
