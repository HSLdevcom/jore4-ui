import { FC, ReactNode } from 'react';
import { GetUserNameById } from '../../../hooks';
import {
  ChangedValueRow,
  getLocationByArrayIndex,
  getParityByArrayIndex,
} from './ChangedValueRow';
import { ChangeHistoryItemSectionHeaderRow } from './ChangeHistoryItemSectionHeaderRow';
import { BaseChangeHistoryItemDetails, ChangedValue } from './types';

export type ChangedValuesWithHeaderRowProps = {
  readonly changedValues: ReadonlyArray<ChangedValue>;
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly sectionTitle: ReactNode;
  readonly sectionTitleClassName?: string;
  readonly testId: string;
};

export const ChangedValuesWithHeaderRow: FC<
  ChangedValuesWithHeaderRowProps
> = ({
  changedValues,
  getUserNameById,
  historyItem,
  sectionTitle,
  sectionTitleClassName,
  testId,
}) => {
  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        className={sectionTitleClassName}
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={sectionTitle}
        testId={testId}
      />

      {changedValues.map((value, i) => (
        <ChangedValueRow
          key={value.key ?? value.field}
          location={getLocationByArrayIndex(changedValues, i)}
          parity={getParityByArrayIndex(i)}
          testId={testId}
          value={value}
        />
      ))}
    </>
  );
};
