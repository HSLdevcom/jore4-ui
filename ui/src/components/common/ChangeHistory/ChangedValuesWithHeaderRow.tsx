import { TFunction } from 'i18next';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChangedValueRow,
  getLocationByArrayIndex,
  getParityByArrayIndex,
} from './ChangedValueRow';
import { ChangeHistoryItemSectionHeaderRow } from './ChangeHistoryItemSectionHeaderRow';
import { BaseChangeHistoryItemDetails, ChangedValue } from './types';

type ChangedValuesWithHeaderRowProps<HistoryItemT, HistoricalDataT> = {
  readonly current: HistoricalDataT;
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly getTitle: (t: TFunction) => ReactNode;
  readonly diffVersions: (
    t: TFunction,
    previous: HistoricalDataT,
    current: HistoricalDataT,
  ) => ReadonlyArray<ChangedValue>;
  readonly historyItem: HistoryItemT;
  readonly previous: HistoricalDataT;
  readonly testId: string;
};

export const ChangedValuesWithHeaderRow = <
  HistoryItemT extends BaseChangeHistoryItemDetails,
  HistoricalDataT,
>({
  current,
  getUserNameById,
  getTitle,
  diffVersions,
  historyItem,
  previous,
  testId,
}: ChangedValuesWithHeaderRowProps<
  HistoryItemT,
  HistoricalDataT
>): ReactNode => {
  const { t } = useTranslation();

  const changes = useMemo(
    () => diffVersions(t, previous, current),
    [current, previous, diffVersions, t],
  );

  if (changes.length === 0) {
    return null;
  }

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={getTitle(t)}
        testId={testId}
      />

      {changes.map((value, i) => (
        <ChangedValueRow
          key={value.key ?? value.field}
          location={getLocationByArrayIndex(changes, i)}
          parity={getParityByArrayIndex(i)}
          testId={testId}
          value={value}
        />
      ))}
    </>
  );
};
