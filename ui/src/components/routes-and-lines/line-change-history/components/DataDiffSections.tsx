import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { useGetLineChangeHistoryItemData } from '../queries';
import {
  LineChangeHistoryItem,
  TruePreviousLineChangeHistoryItem,
} from '../types';
import { DataDiffFailedToLoadSection } from './DataDiffFailedToLoadSection';
import { DataDiffSectionLoading } from './DataDiffSectionLoading';
import { LineDetailsChangedSectionRow } from './LineDetailsChangedSectionRow';
import { RouteDetailsChangedSectionRow } from './RouteDetailsChangedSectionRow';

type DataDiffSectionsProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: LineChangeHistoryItem;
  readonly previousHistoryItem: TruePreviousLineChangeHistoryItem;
};

export const DataDiffSections: FC<DataDiffSectionsProps> = ({
  getUserNameById,
  historyItem,
  previousHistoryItem,
}) => {
  const { loading, currentItemData, previousItemData, error, refetch } =
    useGetLineChangeHistoryItemData(historyItem, previousHistoryItem);

  if (error) {
    return (
      <DataDiffFailedToLoadSection
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        refetch={refetch}
      />
    );
  }

  if (loading) {
    return (
      <DataDiffSectionLoading
        getUserNameById={getUserNameById}
        historyItem={historyItem}
      />
    );
  }

  if (historyItem.routeId) {
    return (
      <RouteDetailsChangedSectionRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        current={currentItemData}
        previous={previousItemData}
      />
    );
  }

  return (
    <LineDetailsChangedSectionRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      current={currentItemData}
      previous={previousItemData}
    />
  );
};
