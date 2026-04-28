import { FC } from 'react';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';
import { PreviousStopPlaceChangeHistoryItem } from '../../../components/ChangeHistory';
import { DataDiffSections } from './DataDiffSections';
import { TerminalChangeHistoryFirstVersionHeaderRow } from './TerminalChangeHistoryFirstVersionHeaderRow';

type TerminalChangeHistoryItemSectionsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly previousHistoryItem: PreviousStopPlaceChangeHistoryItem;
};

export const TerminalChangeHistoryItemSections: FC<
  TerminalChangeHistoryItemSectionsProps
> = ({ getUserNameById, historyItem, previousHistoryItem }) => {
  if (previousHistoryItem === NoEarlierVersionExists) {
    return (
      <TerminalChangeHistoryFirstVersionHeaderRow
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
