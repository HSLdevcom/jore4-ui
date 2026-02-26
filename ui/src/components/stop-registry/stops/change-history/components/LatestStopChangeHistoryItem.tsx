import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { mapUTCToDateTime } from '../../../../../time';
import {
  diffBasicDetails,
  diffLocationDetails,
  diffMeasurementDetails,
  diffOwnerDetails,
  diffShelters,
  diffSignageDetails,
  diffStopAreaAndTerminal,
} from '../utils';
import { useHistoricalStopVersion } from './HistoricalStopDataProvider';
import {
  determineType,
  getHeadingText,
} from './NoPreviousChangeVersionSection';

type LatestStopChangeHistoryItemProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: QuayChangeHistoryItem | null;
  readonly publicCode: string;
};

export const LatestStopChangeHistoryItem: FC<
  LatestStopChangeHistoryItemProps
> = ({ getUserNameById, historyItem, previousHistoryItem, publicCode }) => {
  const { t } = useTranslation();
  const changedBy = getUserNameById(historyItem.changedBy) ?? 'HSL';
  const changedAt = mapUTCToDateTime(historyItem.changed);

  const currentCached = useHistoricalStopVersion(historyItem);
  const previousCached = useHistoricalStopVersion(
    previousHistoryItem ?? historyItem,
  );

  if (!previousHistoryItem) {
    const type = determineType(historyItem);
    const versionText = getHeadingText(t, type);

    return (
      <div className="mb-3 text-sm font-semibold">
        <Link
          to={routeDetails[Path.stopChangeHistory].getLink(publicCode)}
          className="text-brand hover:underline"
        >
          {versionText}
        </Link>
      </div>
    );
  }

  if (
    currentCached?.status === 'fetching' ||
    previousCached?.status === 'fetching'
  ) {
    return <div className="mb-3 text-sm">{t('changeHistory.loading')}</div>;
  }

  if (
    currentCached?.status !== 'fetched' ||
    previousCached?.status !== 'fetched'
  ) {
    return (
      <div className="mb-3 text-sm">{t('changeHistory.failedToLoad')}</div>
    );
  }

  const { value: prev } = previousCached;
  const { value: curr } = currentCached;

  const sections = [
    {
      title: t('stopChangeHistory.stopPlace.title'),
      changes: diffStopAreaAndTerminal(t, prev, curr),
    },
    {
      title: t('stopDetails.basicDetails.title'),
      changes: diffBasicDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.location.title'),
      changes: diffLocationDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.signs.title'),
      changes: diffSignageDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.measurements.title'),
      changes: diffMeasurementDetails(t, prev, curr),
    },
    {
      title: t('stopDetails.maintenance.title'),
      changes: diffOwnerDetails(t, prev, curr),
    },
    {
      title: t('stopChangeHistory.shelters.title'),
      changes: diffShelters(t, prev, curr),
    },
  ].filter((s) => s.changes.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 text-sm">
      {sections.map((section) => (
        <div key={section.title}>
          <Link
            to={routeDetails[Path.stopChangeHistory].getLink(publicCode)}
            className="font-semibold text-brand hover:underline"
          >
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
            {historyItem.versionComment || section.title}
          </Link>
          {section.changes.map((c) => (
            <span className="block" key={c.key ?? String(c.field)}>
              {c.field}: {c.oldValue}{' '}
              <FaPlay className="mx-1 inline text-[8px]" /> {c.newValue}
            </span>
          ))}
        </div>
      ))}
      <div>
        {changedAt} | {changedBy}
      </div>
    </div>
  );
};
