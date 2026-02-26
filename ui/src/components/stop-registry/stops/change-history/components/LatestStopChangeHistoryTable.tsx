import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useGetUserNames } from '../../../../../hooks';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { SimpleButton } from '../../../../../uiComponents';
import { useGetLatestStopChangeHistoryItems } from '../queries/useGetLatestStopChangeHistoryItems';
import { LatestStopChangeHistoryItem } from './LatestStopChangeHistoryItem';

const testIds = {
  container: 'LatestStopChangeHistoryTable::Container',
  title: 'LatestStopChangeHistoryTable::Title',
  loading: 'LatestStopChangeHistoryTable::Loading',
  failedToLoad: 'LatestStopChangeHistoryTable::FailedToLoad',
  retryButton: 'LatestStopChangeHistoryTable::RetryButton',
  showAllLink: 'LatestStopChangeHistoryTable::ShowAllLink',
};

type LatestStopChangeHistoryTableProps = {
  readonly publicCode: string;
  readonly className?: string;
};

export const LatestStopChangeHistoryTable: FC<
  LatestStopChangeHistoryTableProps
> = ({ publicCode, className }) => {
  const { t } = useTranslation();
  const { getUserNameById } = useGetUserNames();

  const { historyItems, loading, error, refetch } =
    useGetLatestStopChangeHistoryItems({
      publicCode,
    });

  if (error) {
    return (
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
    );
  }

  if (loading) {
    return (
      <div className="mt-5 flex justify-center" data-testid={testIds.loading}>
        <p>{t('changeHistory.loading')}</p>
      </div>
    );
  }

  return (
    <div className={className} data-testid={testIds.container}>
      <h3 className="mb-4" data-testid={testIds.title}>
        {t('stopChangeHistory.titleLatest')}
      </h3>
      {historyItems.slice(0, 5).map((item, i) => (
        <LatestStopChangeHistoryItem
          key={`${item.netexId}-${item.version}`}
          getUserNameById={getUserNameById}
          historyItem={item}
          previousHistoryItem={historyItems[i + 1] ?? null}
          publicCode={publicCode}
        />
      ))}
      <Link
        to={routeDetails[Path.stopChangeHistory].getLink(publicCode)}
        className="mt-4 text-sm font-bold text-brand hover:underline"
        data-testid={testIds.showAllLink}
      >
        {t('stopChangeHistory.showAll')}
      </Link>
    </div>
  );
};
