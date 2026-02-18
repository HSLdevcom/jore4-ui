import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { PagingInfo } from '../../../../../types';
import {
  ChangeHistorySortingInfo,
  ChangeHistoryTable,
} from '../../../../common/ChangeHistory';
import { StopChangeHistoryFilters } from '../types';
import { FailedToLoadStopChangeHistory } from './FailedToLoadStopChangeHistory';
import { LoadingStopChangeHistory } from './LoadingStopChangeHistory';
import { StopChangeHistoryDataRows } from './StopChangeHistoryDataRows';

/**
 * Prevent flashing of various loading states on a fast connection.
 *
 * Don't show the loader at all, if we already know the previous result.
 * If we don't know the previous result, show the old results and wait for
 * 0.15s before switching to the loader state.
 *
 * @param loading
 * @param historyItems
 */
function usePrettyLoaderState(
  loading: boolean,
  historyItems: ReadonlyArray<QuayChangeHistoryItem>,
) {
  const [showLoader, setShowLoader] = useState(loading);
  const [previousHistoryItems, setPreviousHistoryItems] =
    useState(historyItems);

  useEffect(() => {
    if (!loading || historyItems.length > 0) {
      setPreviousHistoryItems(historyItems);
    }
  }, [loading, historyItems]);

  useEffect(() => {
    const id = setTimeout(
      () => setShowLoader(loading && historyItems.length === 0),
      150, // Matches with the transition time for the sorting buttons.
    );
    return () => clearTimeout(id);
  }, [loading, historyItems]);

  return { showLoader, previousHistoryItems };
}

type StopChangeHistoryTableProps = {
  readonly className?: string;
  readonly error: Error | null;
  readonly filters: StopChangeHistoryFilters;
  readonly historyItems: ReadonlyArray<QuayChangeHistoryItem>;
  readonly loading: boolean;
  readonly pagingInfo: PagingInfo;
  readonly refetch: () => void;
  readonly setSortingInfo: Dispatch<SetStateAction<ChangeHistorySortingInfo>>;
  readonly sortingInfo: ChangeHistorySortingInfo;
};

export const StopChangeHistoryTable: FC<StopChangeHistoryTableProps> = ({
  className,
  filters,
  error,
  historyItems,
  loading,
  pagingInfo,
  refetch,
  setSortingInfo,
  sortingInfo,
}) => {
  const { showLoader, previousHistoryItems } = usePrettyLoaderState(
    loading,
    historyItems,
  );

  return (
    <ChangeHistoryTable
      className={className}
      setSortingInfo={setSortingInfo}
      sortingInfo={sortingInfo}
    >
      {error !== null && <FailedToLoadStopChangeHistory refetch={refetch} />}

      {error === null && showLoader && <LoadingStopChangeHistory />}

      {error === null && !showLoader && (
        <StopChangeHistoryDataRows
          filters={filters}
          historyItems={loading ? previousHistoryItems : historyItems}
          pagingInfo={pagingInfo}
        />
      )}
    </ChangeHistoryTable>
  );
};
