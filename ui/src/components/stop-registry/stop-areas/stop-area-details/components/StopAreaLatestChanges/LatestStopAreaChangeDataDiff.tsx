import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../../router/routeDetails';
import {
  ErrorLoadingState,
  LatestChangeHistoryItem,
  LoadingState,
} from '../../../../../common/ChangeHistory/latest';
import { useGetHistoricalStopAreaDetails } from '../../../change-history/queries';
import {
  diffStopAreaBasicDetails,
  diffStopAreaStops,
  diffStopAreaTerminal,
} from '../../../change-history/utils';

const testIds = {
  loading: 'LatestStopAreaChangeHistoryTable::Item::Loading',
  error: 'LatestStopAreaChangeHistoryTable::Item::Error',
  diff: 'LatestStopAreaChangeHistoryTable::Item::Diff',
};

type LatestStopAreaChangeDataDiffProps = {
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly previousHistoryItem: StopPlaceChangeHistoryItem;
  readonly privateCode: string;
};

export const LatestStopAreaChangeDataDiff: FC<
  LatestStopAreaChangeDataDiffProps
> = ({ historyItem, previousHistoryItem, privateCode }) => {
  const { t } = useTranslation();

  const {
    data: current,
    error: currentError,
    refetch: currentRefetch,
    loading: currentLoading,
  } = useGetHistoricalStopAreaDetails(historyItem);
  const {
    data: previous,
    error: previousError,
    refetch: previousRefetch,
    loading: previousLoading,
  } = useGetHistoricalStopAreaDetails(previousHistoryItem);

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
          title: t(($) => $.stopAreaChangeHistory.sectionTitle),
          changes: diffStopAreaBasicDetails(t, previous, current),
        },
        {
          title: t(($) => $.stopAreaChangeHistory.stopsSectionTitle),
          changes: diffStopAreaStops(t, previous, current),
        },
        {
          title: t(($) => $.stopAreaChangeHistory.terminalSectionTitle),
          changes: diffStopAreaTerminal(t, previous, current),
        },
      ].filter((it) => it.changes.length > 0)}
      link={routeDetails[Path.stopAreaChangeHistory].getLink(privateCode)}
      testId={testIds.diff}
    />
  );
};
