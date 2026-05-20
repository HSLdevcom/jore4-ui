import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Path, routeDetails } from '../../../../router/routeDetails';
import {
  ErrorLoadingState,
  LatestChangeHistoryItem,
  LoadingState,
} from '../../../common/ChangeHistory/latest';
import { useGetLineChangeHistoryItemData } from '../queries';
import { LineChangeHistoryItem, PreviousLineChangeHistoryItem } from '../types';
import { diffLine } from '../utils';

const testIds = {
  loading: 'LatestLineChangeHistoryTable::Item::Loading',
  error: 'LatestLineChangeHistoryTable::Item::Error',
  diff: 'LatestLineChangeHistoryTable::Item::Diff',
};

type LatestLineChangeDataDiffProps = {
  readonly historyItem: LineChangeHistoryItem;
  readonly previousHistoryItem: PreviousLineChangeHistoryItem;
  readonly label: string;
};

export const LatestLineChangeDataDiff: FC<LatestLineChangeDataDiffProps> = ({
  historyItem,
  previousHistoryItem,
  label,
}) => {
  const { t } = useTranslation();

  const result = useGetLineChangeHistoryItemData(
    historyItem,
    previousHistoryItem as LineChangeHistoryItem,
  );

  if (result.loading) {
    return <LoadingState testIdPrefix={testIds.loading} />;
  }

  if (result.error) {
    return (
      <ErrorLoadingState
        testIdPrefix={testIds.error}
        onRetry={result.refetch}
      />
    );
  }

  const sections = [
    {
      title: t(($) => $.lineChangeHistory.lineSectionTitle, {
        lineLabel: result.currentItemData.label,
        name: result.currentItemData.name_i18n.fi_FI,
      }),
      changes: diffLine(t, result.previousItemData, result.currentItemData),
    },
  ].filter((it) => it.changes.length > 0);

  return (
    <LatestChangeHistoryItem
      historyItem={historyItem}
      sections={sections}
      link={routeDetails[Path.lineChangeHistory].getLink(label)}
      testId={testIds.diff}
    />
  );
};
