import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import {
  ErrorLoadingState,
  LoadingState,
} from '../../../../common/ChangeHistory/latest';
import { useGetLatestStopPlaceChangeHistory } from '../../../components/ChangeHistory/queries';
import { findPreviousTiamatHistoryItemVersion } from '../../../utils';
import { LatestTerminalChangeHistoryItem } from './LatestTerminalChangeHistoryItem';

const testIds = {
  container: 'LatestTerminalChangeHistoryTable::Container',
  title: 'LatestTerminalChangeHistoryTable::Title',
  loading: 'LatestTerminalChangeHistoryTable::Loading',
  failedToLoad: 'LatestTerminalChangeHistoryTable::FailedToLoad',
  retryButton: 'LatestTerminalChangeHistoryTable::RetryButton',
  showAllLink: 'LatestTerminalChangeHistoryTable::ShowAllLink',
};

type TerminalLatestChangesProps = {
  readonly className?: string;
  readonly privateCode: string;
};

export const TerminalLatestChanges: FC<TerminalLatestChangesProps> = ({
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
        testIdPrefix="LatestTerminalChangeHistoryTable"
      />
    );
  }

  if (loading) {
    return <LoadingState testIdPrefix="LatestTerminalChangeHistoryTable" />;
  }

  return (
    <div className={className} data-testid={testIds.container}>
      <h3 className="mb-4" data-testid={testIds.title}>
        {t(($) => $.stopChangeHistory.titleLatest)}
      </h3>
      {latestHistoryItems.map((item) => {
        return (
          <LatestTerminalChangeHistoryItem
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
        to={routeDetails[Path.terminalChangeHistory].getLink(privateCode)}
        className="mt-4 text-sm font-bold text-brand hover:underline"
        data-testid={testIds.showAllLink}
      >
        {t(($) => $.stopChangeHistory.showAll)}
      </Link>
    </div>
  );
};
