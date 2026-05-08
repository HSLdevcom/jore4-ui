import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import {
  ErrorLoadingState,
  LatestChangeHistoryItem,
  LoadingState,
} from '../../../../common/ChangeHistory/latest';
import { useGetHistoricalTerminalDetails } from '../../change-history/queries';
import {
  diffInfoSpots,
  diffTerminalBasicDetails,
  diffTerminalExternalLinks,
  diffTerminalOwnerDetails,
  diffTerminalStops,
} from '../../change-history/utils';

const testIds = {
  loading: 'LatestTerminalChangeHistoryTable::Item::Loading',
  error: 'LatestTerminalChangeHistoryTable::Item::Error',
  diff: 'LatestTerminalChangeHistoryTable::Item::Diff',
};

type LatestTerminalChangeDataDiffProps = {
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly previousHistoryItem: StopPlaceChangeHistoryItem;
  readonly privateCode: string;
};

export const LatestTerminalChangeDataDiff: FC<
  LatestTerminalChangeDataDiffProps
> = ({ historyItem, previousHistoryItem, privateCode }) => {
  const { t } = useTranslation();

  const {
    data: current,
    error: currentError,
    refetch: currentRefetch,
    loading: currentLoading,
  } = useGetHistoricalTerminalDetails(historyItem);
  const {
    data: previous,
    error: previousError,
    refetch: previousRefetch,
    loading: previousLoading,
  } = useGetHistoricalTerminalDetails(previousHistoryItem);

  if (currentLoading || previousLoading) {
    return <LoadingState testIdPrefix={testIds.loading} />;
  }

  if (currentError || previousError || !current || !previous) {
    return (
      <ErrorLoadingState
        testIdPrefix={testIds.error}
        onRetry={() => {
          if (currentError) {
            currentRefetch();
          }
          if (previousError) {
            previousRefetch();
          }
        }}
      />
    );
  }

  return (
    <LatestChangeHistoryItem
      historyItem={historyItem}
      sections={[
        {
          title: t(($) => $.terminalChangeHistory.sectionTitle),
          changes: diffTerminalBasicDetails(t, previous, current),
        },
        {
          title: t(($) => $.terminalChangeHistory.stopsSectionTitle),
          changes: diffTerminalStops(t, previous, current),
        },
        {
          title: t(($) => $.stopDetails.externalLinks.externalLinks),
          changes: diffTerminalExternalLinks(t, previous, current),
        },
        {
          title: t(($) => $.terminalChangeHistory.ownerDetails),
          changes: diffTerminalOwnerDetails(t, previous, current),
        },
        {
          title: t(($) => $.terminalChangeHistory.infoSpots.title),
          changes: diffInfoSpots(t, previous, current),
        },
      ].filter((it) => it.changes.length > 0)}
      link={routeDetails[Path.terminalChangeHistory].getLink(privateCode)}
      testId={testIds.diff}
    />
  );
};
