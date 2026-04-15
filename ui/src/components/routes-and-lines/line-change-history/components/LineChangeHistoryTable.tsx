import { Dispatch, FC, SetStateAction } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { PagingInfo } from '../../../../types';
import {
  ChangeHistorySortingInfo,
  ChangeHistoryTable,
  FailedToLoadChangeHistory,
  LoadingChangeHistory,
} from '../../../common/ChangeHistory';
import { LineChangeHistoryItem } from '../types';
import { LineChangeHistoryDataRows } from './LineChangeHistoryDataRows';

type LineChangeHistoryTableProps = {
  readonly className?: string;
  readonly error: Error | null;
  readonly getUserNameById: GetUserNameById;
  readonly historyItems: ReadonlyArray<LineChangeHistoryItem>;
  readonly sortedHistoryItems: ReadonlyArray<LineChangeHistoryItem>;
  readonly loading: boolean;
  readonly pagingInfo: PagingInfo;
  readonly refetch: () => void;
  readonly setSortingInfo: Dispatch<SetStateAction<ChangeHistorySortingInfo>>;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

export const LineChangeHistoryTable: FC<LineChangeHistoryTableProps> = ({
  className,
  getUserNameById,
  error,
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
        <LineChangeHistoryDataRows
          getUserNameById={getUserNameById}
          historyItems={historyItems}
          sortedHistoryItems={sortedHistoryItems}
          pagingInfo={pagingInfo}
        />
      )}
    </ChangeHistoryTable>
  );
};
