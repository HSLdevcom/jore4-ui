import { FC } from 'react';
import { useGetUserNames, useRequiredParams } from '../../../hooks';
import {
  DateRangeFilter,
  useChangeHistoryPageRouterState,
} from '../../common/ChangeHistory';
import { Container } from '../../common/LayoutComponents';
import { Pagination } from '../../common/Pagination';
import {
  LineChangeHistoryPageTitleRow,
  LineChangeHistoryTable,
} from './components';
import {
  useGetLineChangeHistoryItems,
  useGetTodaysNameForLine,
} from './queries';

const testIds = {
  container: 'LineChangeHistoryPage::Container',
};

export const LineChangeHistoryPage: FC = () => {
  const {
    filters,
    setFilters,
    pagingInfo,
    setPagingInfo,
    sortingInfo,
    setSortingInfo,
  } = useChangeHistoryPageRouterState();

  const { label } = useRequiredParams<{ label: string }>();
  const { todaysNameForLine } = useGetTodaysNameForLine(
    label,
    filters.priority,
  );

  const { getUserNameById } = useGetUserNames();
  const { historyItems, sortedHistoryItems, loading, error, refetch } =
    useGetLineChangeHistoryItems({
      filters,
      getUserNameById,
      label,
      sortingInfo,
    });

  return (
    <Container
      className="flex flex-col items-stretch"
      testId={testIds.container}
      type="fluid"
    >
      <LineChangeHistoryPageTitleRow names={todaysNameForLine} label={label} />

      <DateRangeFilter
        className="mt-5"
        filters={filters}
        setFilters={setFilters}
      />

      <LineChangeHistoryTable
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
