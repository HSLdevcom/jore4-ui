import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { ChangedValuesWithHeaderRow } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, LineData } from '../types';
import { diffLine } from '../utils';
import { ItemTitle } from './ItemTitle';

type LineDetailsChangedSectionRowProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: LineChangeHistoryItem;
  readonly current: LineData;
  readonly previous: LineData;
};

export const LineDetailsChangedSectionRow: FC<
  LineDetailsChangedSectionRowProps
> = ({ getUserNameById, historyItem, current, previous }) => {
  return (
    <ChangedValuesWithHeaderRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      diffVersions={diffLine}
      current={current}
      previous={previous}
      testId="LineDetails"
      sectionTitle={<ItemTitle item={historyItem} />}
    />
  );
};
