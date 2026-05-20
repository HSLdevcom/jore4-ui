import { FC } from 'react';
import {
  ErrorLoadingState,
  LoadingState,
} from '../../../../common/ChangeHistory/latest';
import { useGetLineChangeHistoryItemData } from '../../queries';
import {
  LineChangeHistoryItem,
  LineData,
  PreviousLineChangeHistoryItem,
} from '../../types';
import { LatestLineChangeSection } from './LatestLineChangeSection';
import { LatestRouteChangeSection } from './LatestRouteChangeSection';

const testIds = {
  loading: 'LatestLineChangeHistoryTable::Item::Loading',
  error: 'LatestLineChangeHistoryTable::Item::Error',
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

  const currentItemData = result.currentItemData as LineData;
  const previousItemData = result.previousItemData as LineData;

  if (historyItem.routeId) {
    return (
      <LatestRouteChangeSection
        historyItem={historyItem}
        currentItemData={currentItemData}
        previousItemData={previousItemData}
        label={label}
      />
    );
  }

  return (
    <LatestLineChangeSection
      historyItem={historyItem}
      currentItemData={currentItemData}
      previousItemData={previousItemData}
      label={label}
    />
  );
};
