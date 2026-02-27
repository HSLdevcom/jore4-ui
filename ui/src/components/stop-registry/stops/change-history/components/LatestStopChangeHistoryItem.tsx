import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { Priority } from '../../../../../types/enums';
import {
  ErrorLoadingState,
  LatestChangeHistoryItem,
  LoadingState,
} from '../../../../common/ChangeHistory/latest';
import { latestStopChangeSections } from '../utils/latestStopChangeSections';
import { useHistoricalStopVersion } from './HistoricalStopDataProvider';
import {
  determineType,
  getHeadingText,
} from './NoPreviousChangeVersionSection';

type LatestStopChangeHistoryItemProps = {
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: QuayChangeHistoryItem | null;
  readonly publicCode: string;
  readonly priority: Priority;
};

export const LatestStopChangeHistoryItem: FC<
  LatestStopChangeHistoryItemProps
> = ({ historyItem, previousHistoryItem, publicCode, priority }) => {
  const { t } = useTranslation();

  const currentCached = useHistoricalStopVersion(historyItem);
  const previousCached = useHistoricalStopVersion(
    previousHistoryItem ?? historyItem,
  );

  const link = routeDetails[Path.stopChangeHistory].getLink(publicCode, {
    priority: priority === Priority.Standard ? undefined : priority,
  });

  if (!previousHistoryItem) {
    const type = determineType(historyItem);
    const versionText = getHeadingText(t, type);
    return (
      <div className="mb-3 text-sm font-semibold">
        <Link to={link} className="text-brand hover:underline">
          {versionText}
        </Link>
      </div>
    );
  }

  if (
    currentCached?.status === 'fetching' ||
    previousCached?.status === 'fetching'
  ) {
    return <LoadingState />;
  }

  if (
    currentCached?.status !== 'fetched' ||
    previousCached?.status !== 'fetched'
  ) {
    return <ErrorLoadingState />;
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
      link={link}
    />
  );
};
