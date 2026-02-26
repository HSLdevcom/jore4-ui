import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { Priority } from '../../../../../types/enums';
import {
  ErrorLoadingState,
  LoadingState,
} from '../../../../common/ChangeHistory';
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
  readonly priority: Priority;
  readonly className?: string;
};

export const LatestStopChangeHistoryTable: FC<
  LatestStopChangeHistoryTableProps
> = ({ publicCode, priority, className }) => {
  const { t } = useTranslation();

  const { historyItems, loading, error, refetch } =
    useGetLatestStopChangeHistoryItems({
      publicCode,
    });

  if (error) {
    return (
      <ErrorLoadingState
        onRetry={() => refetch()}
        testIdPrefix="LatestStopChangeHistoryTable"
      />
    );
  }

  if (loading) {
    return <LoadingState testIdPrefix="LatestStopChangeHistoryTable" />;
  }

  return (
    <div className={className} data-testid={testIds.container}>
      <h3 className="mb-4" data-testid={testIds.title}>
        {t('stopChangeHistory.titleLatest')}
      </h3>
      {historyItems.slice(0, 5).map((item, i) => {
        return (
          <LatestStopChangeHistoryItem
            key={`${item.netexId}-${item.version}`}
            historyItem={item}
            previousHistoryItem={historyItems[i + 1] ?? null}
            publicCode={publicCode}
            priority={priority}
          />
        );
      })}
      <Link
        to={routeDetails[Path.stopChangeHistory].getLink(publicCode, {
          priority: priority === Priority.Standard ? undefined : priority,
        })}
        className="mt-4 text-sm font-bold text-brand hover:underline"
        data-testid={testIds.showAllLink}
      >
        {t('stopChangeHistory.showAll')}
      </Link>
    </div>
  );
};
