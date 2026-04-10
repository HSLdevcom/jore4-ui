import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { NoEarlierVersionExists } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, PreviousLineChangeHistoryItem } from '../types';
import { DataDiffSections } from './DataDiffSections';
import { LineChangeDeletedVersionHeaderRow } from './LineChangeDeletedVersionHeaderRow';
import { LineChangeFirstVersionHeaderRow } from './LineChangeFirstVersionHeaderRow';

type LineChangeHistoryItemSectionsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: LineChangeHistoryItem;
  readonly previousHistoryItem: PreviousLineChangeHistoryItem;
};

export const LineChangeHistoryItemSections: FC<
  LineChangeHistoryItemSectionsProps
> = ({ getUserNameById, historyItem, previousHistoryItem }) => {
  if (previousHistoryItem === NoEarlierVersionExists) {
    return (
      <LineChangeFirstVersionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
      />
    );
  }

  if (historyItem.tgOperation === 'DELETE') {
    return (
      <LineChangeDeletedVersionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
      />
    );
  }

  return (
    <DataDiffSections
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      previousHistoryItem={previousHistoryItem}
    />
  );
};
