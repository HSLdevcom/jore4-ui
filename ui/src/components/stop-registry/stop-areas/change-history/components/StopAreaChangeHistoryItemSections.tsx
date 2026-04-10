import { FC } from 'react';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';
import { PreviousStopPlaceChangeHistoryItem } from '../types';
import { DataDiffSections } from './DataDiffSections';
import { StopAreaChangeHistoryFirstVersionHeaderRow } from './StopAreaChangeHistoryFirstVersionHeaderRow';

type StopAreaChangeHistoryItemSectionsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly previousHistoryItem: PreviousStopPlaceChangeHistoryItem;
};

export const StopAreaChangeHistoryItemSections: FC<
  StopAreaChangeHistoryItemSectionsProps
> = ({ getUserNameById, historyItem, previousHistoryItem }) => {
  if (previousHistoryItem === NoEarlierVersionExists) {
    return (
      <StopAreaChangeHistoryFirstVersionHeaderRow
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
