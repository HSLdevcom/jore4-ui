import { FC } from 'react';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';
import { PreviousQuayChangeHistoryItem } from '../types';
import { DataDiffSections } from './DataDiffSections';
import { NoPreviousChangeVersionSection } from './NoPreviousChangeVersionSection';

type StopChangeHistoryItemProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: PreviousQuayChangeHistoryItem;
};

export const StopChangeHistoryItem: FC<StopChangeHistoryItemProps> = ({
  getUserNameById,
  historyItem,
  previousHistoryItem,
}) => {
  if (previousHistoryItem === NoEarlierVersionExists) {
    return (
      <NoPreviousChangeVersionSection
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
