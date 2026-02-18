import { FC } from 'react';
import { useRequiredParams } from '../../../../hooks';
import { Container } from '../../../../layoutComponents';
import { Pagination } from '../../../../uiComponents';
import {
  DateRangeFilter,
  HistoricalStopDataProvider,
  StopChangeHistoryNames,
  StopChangeHistoryPageTitleRow,
  StopChangeHistoryTable,
} from './components';
import {
  useGetStopChangeHistoryItems,
  useGetTodaysNameForQuay,
} from './queries';
import { useStopChangeHistoryPageRouterState } from './utils';

const testIds = {
  container: 'StopChangeHistoryPage::Container',
  title: 'StopChangeHistoryPage::title',
  names: 'StopChangeHistoryPage::names',
};

export const StopChangeHistoryPage: FC = () => {
  const {
    filters,
    setFilters,
    pagingInfo,
    setPagingInfo,
    sortingInfo,
    setSortingInfo,
  } = useStopChangeHistoryPageRouterState();

  const { label: publicCode } = useRequiredParams<{ label: string }>();
  const { todaysNameForQuay } = useGetTodaysNameForQuay(
    publicCode,
    filters.priority,
  );
  const { historyItems, loading, error, refetch } =
    useGetStopChangeHistoryItems({
      filters,
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
          filters={filters}
          historyItems={historyItems}
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
