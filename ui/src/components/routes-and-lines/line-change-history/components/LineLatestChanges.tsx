import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../router/routeDetails';
import {
  ErrorLoadingState,
  LoadingState,
} from '../../../common/ChangeHistory/latest';
import { useGetLatestLineChangeHistory } from '../queries';
import { findPreviousLineHistoryItemVersion } from '../utils';
import { LatestLineChangeHistoryItem } from './LatestLineChangeHistoryItem';

const testIds = {
  container: 'LatestLineChangeHistoryTable::Container',
  title: 'LatestLineChangeHistoryTable::Title',
  loading: 'LatestLineChangeHistoryTable::Loading',
  failedToLoad: 'LatestLineChangeHistoryTable::FailedToLoad',
  retryButton: 'LatestLineChangeHistoryTable::RetryButton',
  showAllLink: 'LatestLineChangeHistoryTable::ShowAllLink',
};

type LineLatestChangesProps = {
  readonly className?: string;
  readonly label: string;
};

export const LineLatestChanges: FC<LineLatestChangesProps> = ({
  className,
  label,
}) => {
  const { t } = useTranslation();
  const { historyItems, latestHistoryItems, loading, error, refetch } =
    useGetLatestLineChangeHistory(label);

  if (error) {
    return (
      <ErrorLoadingState
        onRetry={() => refetch()}
        testIdPrefix="LatestLineChangeHistoryTable"
      />
    );
  }

  if (loading) {
    return <LoadingState testIdPrefix="LatestLineChangeHistoryTable" />;
  }

  return (
    <div className={className} data-testid={testIds.container}>
      <h3 className="mb-4" data-testid={testIds.title}>
        {t(($) => $.stopChangeHistory.titleLatest)}
      </h3>
      {latestHistoryItems.map((item) => {
        return (
          <LatestLineChangeHistoryItem
            key={item.id}
            historyItem={item}
            previousHistoryItem={findPreviousLineHistoryItemVersion(
              historyItems,
              item,
            )}
            label={label}
          />
        );
      })}
      <Link
        to={routeDetails[Path.lineChangeHistory].getLink(label)}
        className="mt-4 text-sm font-bold text-brand hover:underline"
        data-testid={testIds.showAllLink}
      >
        {t(($) => $.stopChangeHistory.showAll)}
      </Link>
    </div>
  );
};
