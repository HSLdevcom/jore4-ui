import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { Priority } from '../../../../../types/enums';
import {
  ErrorLoadingState,
  LatestChangeHistoryItem,
  LoadingState,
} from '../../../../common/ChangeHistory/latest';
import { latestStopChangeSections } from '../utils/latestStopChangeSections';
import {
  useHistoricalStopVersion,
  useRefetchFailedHistoricalStopVersions,
} from './HistoricalStopDataProvider';

const testIds = {
  prefix: 'LatestStopChangeHistoryTable::Item:',
  diff: 'LatestStopChangeHistoryTable::Item::Diffs',
};

type LatestStopChangeDataDiffProps = {
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: QuayChangeHistoryItem;
  readonly publicCode: string;
  readonly priority: Priority;
};

export const LatestStopChangeDataDiff: FC<LatestStopChangeDataDiffProps> = ({
  historyItem,
  previousHistoryItem,
  publicCode,
  priority,
}) => {
  const { t } = useTranslation();

  const currentCached = useHistoricalStopVersion(historyItem);
  const previousCached = useHistoricalStopVersion(previousHistoryItem);
  const refetchFailed = useRefetchFailedHistoricalStopVersions();

  if (
    currentCached.status === 'fetching' ||
    previousCached.status === 'fetching'
  ) {
    return <LoadingState testIdPrefix={testIds.prefix} />;
  }

  if (
    currentCached.status !== 'fetched' ||
    previousCached.status !== 'fetched'
  ) {
    return (
      <ErrorLoadingState
        onRetry={refetchFailed}
        testIdPrefix={testIds.prefix}
      />
    );
  }

  const sections = latestStopChangeSections(
    t,
    previousCached.value,
    currentCached.value,
  );

  return (
    <LatestChangeHistoryItem
      historyItem={historyItem}
      sections={sections}
      link={routeDetails[Path.stopChangeHistory].getLink(publicCode, {
        priority: priority === Priority.Standard ? undefined : priority,
      })}
      testId={testIds.diff}
    />
  );
};
