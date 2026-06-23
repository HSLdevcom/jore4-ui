import { FC } from 'react';
import { useGetUserNames, useRequiredParams } from '../../../../hooks';
import { Pagination } from '../../../../uiComponents';
import {
  DateRangeFilter,
  useChangeHistoryPageRouterState,
} from '../../../common/ChangeHistory';
import { Container } from '../../../common/LayoutComponents';
import {
  HistoricalStopDataProvider,
  StopChangeHistoryNames,
  StopChangeHistoryPageTitleRow,
  StopChangeHistoryTable,
} from './components';
import {
  useGetStopChangeHistoryItems,
  useGetTodaysNameForQuay,
} from './queries';

const testIds = {
  container: 'StopChangeHistoryPage::Container',
};

export const StopChangeHistoryPage: FC = () => {
  const {
    filters,
    setFilters,
    pagingInfo,
    setPagingInfo,
    sortingInfo,
    setSortingInfo,
  } = useChangeHistoryPageRouterState();

  const { label: publicCode } = useRequiredParams<{ label: string }>();
  const { todaysNameForQuay } = useGetTodaysNameForQuay(
    publicCode,
    filters.priority,
  );

  const { getUserNameById } = useGetUserNames();
  const { historyItems, sortedHistoryItems, loading, error, refetch } =
    useGetStopChangeHistoryItems({
      filters,
      getUserNameById,
      publicCode,
      sortingInfo,
    });

  return (
    <Container
      className="flex flex-col items-stretch"
      testId={testIds.container}
      type="fluid"
    >
      <StopChangeHistoryPageTitleRow
        name={todaysNameForQuay.name}
        publicCode={publicCode}
      />
      <StopChangeHistoryNames names={todaysNameForQuay} />

      <DateRangeFilter
        className="mt-5"
        filters={filters}
        setFilters={setFilters}
      />

      <HistoricalStopDataProvider>
        <StopChangeHistoryTable
          className="mt-5"
          error={error ?? null}
          getUserNameById={getUserNameById}
          historyItems={historyItems}
          sortedHistoryItems={sortedHistoryItems}
          loading={loading}
          pagingInfo={pagingInfo}
          refetch={refetch}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />

        <Pagination
          className="mt-5 self-center"
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
          totalItemsCount={historyItems.length}
        />
      </HistoricalStopDataProvider>
    </Container>
  );
};
