import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateBackSafely, useRequiredParams } from '../../../../hooks';
import { Container, Row } from '../../../../layoutComponents';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { CloseIconButton, SimpleButton } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { PageTitle } from '../../../common';
import { DateRangeFilter } from './components/DateRangeFilter';
import { HistoricalStopDataProvider } from './components/HistoricalStopDataProvider';
import { StopChangeHistoryTable } from './components/StopChangeHistoryTable';
import { useGetStopChangeHistoryItems } from './queries/useGetStopChangeHistoryItems';
import { useGetTodaysNameForQuay } from './queries/useGetTodaysNameForQuay';
import { useStopChangeHistoryPageRouterState } from './utils/useStopChangeHistoryPageRouterState';

const testIds = {
  container: 'StopChangeHistoryPage::Container',
  loadingWrapper: 'StopChangeHistoryPage::LoadingWrapper',
  failedToLoad: 'StopChangeHistoryPage::FailedToLoad',
  retryButton: 'StopChangeHistoryPage::RetryButton',
  title: 'StopChangeHistoryPage::title',
  returnButton: 'StopChangeHistoryPage::returnButton',
  names: 'StopChangeHistoryPage::names',
};

export const StopChangeHistoryPage: FC = () => {
  const { t } = useTranslation();

  const { filters, setFilters, sortingInfo, setSortingInfo } =
    useStopChangeHistoryPageRouterState();

  const goBack = useNavigateBackSafely();

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

  const titleText = todaysNameForQuay.name
    ? t('stopChangeHistory.titleWithName', {
        publicCode,
        name: todaysNameForQuay.name,
      })
    : t(t('stopChangeHistory.title', { publicCode }));

  return (
    <Container testId={testIds.container} type="fluid">
      <Row className="items-end justify-between">
        <PageTitle.H1 titleText={titleText} testId={testIds.title}>
          {t('stopChangeHistory.title', { publicCode })}
        </PageTitle.H1>

        <CloseIconButton
          className="font-bold text-brand [&>i]:text-xl"
          onClick={() =>
            goBack(routeDetails[Path.stopDetails].getLink(publicCode), {
              replace: true,
            })
          }
          testId={testIds.returnButton}
          label={t('stopChangeHistory.goBack')}
        />
      </Row>
      <Row>
        {todaysNameForQuay.name && (
          <h2 data-testid={testIds.names}>
            <span>{todaysNameForQuay.name}</span>
            {' - '}
            <span>{todaysNameForQuay.nameSwe}</span>
          </h2>
        )}
      </Row>

      <DateRangeFilter
        className="mt-5"
        filters={filters}
        setFilters={setFilters}
      />

      <HistoricalStopDataProvider>
        <LoadingWrapper
          className="flex justify-center"
          loadingText={t('changeHistory.loading')}
          loading={loading}
          testId={testIds.loadingWrapper}
        >
          {error ? (
            <div
              className="mt-5 flex flex-col items-center justify-center"
              data-testid={testIds.failedToLoad}
            >
              <p>{t('changeHistory.failedToLoad')}</p>
              <SimpleButton
                className="mt-5"
                onClick={() => refetch()}
                testId={testIds.retryButton}
              >
                {t('changeHistory.tryAgainButton')}
              </SimpleButton>
            </div>
          ) : (
            <StopChangeHistoryTable
              className="mt-5 w-full"
              filters={filters}
              historyItems={historyItems}
              setSortingInfo={setSortingInfo}
              sortingInfo={sortingInfo}
            />
          )}
        </LoadingWrapper>
      </HistoricalStopDataProvider>
    </Container>
  );
};
