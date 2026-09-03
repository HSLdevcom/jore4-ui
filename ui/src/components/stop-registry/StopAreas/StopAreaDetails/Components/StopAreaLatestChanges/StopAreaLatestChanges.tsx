import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../../router/routeDetails';
import {
  ErrorLoadingState,
  LoadingState,
} from '../../../../../common/ChangeHistory/latest';
import { useGetLatestStopPlaceChangeHistory } from '../../../../components/ChangeHistory/queries';
import { findPreviousTiamatHistoryItemVersion } from '../../../../utils';
import { LatestStopAreaChangeHistoryItem } from './LatestStopAreaChangeHistoryItem';

const testIds = {
  container: 'LatestStopAreaChangeHistoryTable::Container',
  title: 'LatestStopAreaChangeHistoryTable::Title',
  loading: 'LatestStopAreaChangeHistoryTable::Loading',
  failedToLoad: 'LatestStopAreaChangeHistoryTable::FailedToLoad',
  retryButton: 'LatestStopAreaChangeHistoryTable::RetryButton',
  showAllLink: 'LatestStopAreaChangeHistoryTable::ShowAllLink',
};

type StopAreaLatestChangesProps = {
  readonly className?: string;
  readonly privateCode: string;
};

export const StopAreaLatestChanges: FC<StopAreaLatestChangesProps> = ({
  className,
  privateCode,
}) => {
  const { t } = useTranslation();
  const { historyItems, latestHistoryItems, loading, error, refetch } =
    useGetLatestStopPlaceChangeHistory(privateCode);

  if (error) {
    return (
      <ErrorLoadingState
        onRetry={() => refetch()}
        testIdPrefix="LatestStopAreaChangeHistoryTable"
      />
    );
  }

  if (loading) {
    return <LoadingState testIdPrefix="LatestStopAreaChangeHistoryTable" />;
  }

  return (
    <div className={className} data-testid={testIds.container}>
      <h3 className="mb-4" data-testid={testIds.title}>
        {t(($) => $.stopChangeHistory.titleLatest)}
      </h3>
      {latestHistoryItems.map((item) => {
        return (
          <LatestStopAreaChangeHistoryItem
            key={`${item.netexId}-${item.version}`}
            historyItem={item}
            previousHistoryItem={findPreviousTiamatHistoryItemVersion(
              historyItems,
              item,
            )}
            privateCode={privateCode}
          />
        );
      })}
      <Link
        to={routeDetails[Path.stopAreaChangeHistory].getLink(privateCode)}
        className="mt-4 text-sm font-bold text-brand hover:underline"
        data-testid={testIds.showAllLink}
      >
        {t(($) => $.stopChangeHistory.showAll)}
      </Link>
    </div>
  );
};
