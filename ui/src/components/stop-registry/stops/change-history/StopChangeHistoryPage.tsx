import { DateTime } from 'luxon';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderBy } from '../../../../generated/graphql';
import { useNavigateBackSafely, useRequiredParams } from '../../../../hooks';
import { Container, Row } from '../../../../layoutComponents';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { CloseIconButton, SimpleButton } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { PageTitle } from '../../../common';
import { HistoricalStopDataProvider } from './components/HistoricalStopDataProvider';
import { StopChangeHistoryTable } from './components/StopChangeHistoryTable';
import { useGetStopChangeHistoryItems } from './queries/useGetStopChangeHistoryItems';
import { useGetTodaysNameForQuay } from './queries/useGetTodaysNameForQuay';

const testIds = {
  container: 'StopChangeHistoryPage::Container',
  loadingWrapper: 'StopChangeHistoryPage::LoadingWrapper',
  failedToLoad: 'StopChangeHistoryPage::FailedToLoad',
  retryButton: 'StopChangeHistoryPage::RetryButton',
  title: 'StopChangeHistoryPage::title',
  returnButton: 'StopChangeHistoryPage::returnButton',
  names: 'StopChangeHistoryPage::names',
};

type StopChangeHistoryFilters = {
  readonly from: DateTime;
  readonly to: DateTime;
};

export const StopChangeHistoryPage: FC = () => {
  const { t } = useTranslation();

  const [{ from, to }] = useState<StopChangeHistoryFilters>(() => ({
    from: DateTime.now().minus({ month: 6 }).startOf('month'),
    to: DateTime.now(),
  }));

  const goBack = useNavigateBackSafely();

  const { label: publicCode } = useRequiredParams<{ label: string }>();
  const { todaysNameForQuay } = useGetTodaysNameForQuay(publicCode);
  const { historyItems, loading, error, refetch } =
    useGetStopChangeHistoryItems({
      publicCode,
      from,
      to,
      orderBy: [{ changed: OrderBy.Desc }, { version: OrderBy.Desc }],
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
              historyItems={historyItems}
            />
          )}
        </LoadingWrapper>
      </HistoricalStopDataProvider>
    </Container>
  );
};
