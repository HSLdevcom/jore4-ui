import { FC } from 'react';
import { useGetUserNames, useRequiredParams } from '../../../../hooks';
import { Container } from '../../../../layoutComponents';
import { Pagination } from '../../../../uiComponents';
import {
  DateRangeFilter,
  useChangeHistoryPageRouterState,
} from '../../../common/ChangeHistory';
import { useGetTodaysNameForStopPlace } from '../../stop-areas/change-history/queries';
import { useGetStopPlaceChangeHistory } from '../../stop-areas/change-history/queries/useGetStopPlaceChangeHistory';
import {
  TerminalChangeHistoryPageTitleRow,
  TerminalChangeHistoryTable,
} from './components';

const testIds = {
  container: 'TerminalChangeHistoryPage::Container',
};

export const TerminalChangeHistoryPage: FC = () => {
  const {
    filters,
    setFilters,
    pagingInfo,
    setPagingInfo,
    sortingInfo,
    setSortingInfo,
  } = useChangeHistoryPageRouterState();

  const { privateCode } = useRequiredParams<{ privateCode: string }>();
  const { todaysNameForStopPlace } = useGetTodaysNameForStopPlace(privateCode);

  const { getUserNameById } = useGetUserNames();
  const { historyItems, sortedHistoryItems, loading, error, refetch } =
    useGetStopPlaceChangeHistory({
      filters,
      getUserNameById,
      privateCode,
      sortingInfo,
    });

  return (
    <Container
      className="flex flex-col items-stretch"
      testId={testIds.container}
      type="fluid"
    >
      <TerminalChangeHistoryPageTitleRow
        names={todaysNameForStopPlace}
        privateCode={privateCode}
      />

      <DateRangeFilter
        className="mt-5"
        filters={filters}
        setFilters={setFilters}
      />

      <TerminalChangeHistoryTable
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
    </Container>
  );
};
