import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { ChangeValueSections } from '../../../common/ChangeHistory';
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
  const sectionTitle = <ItemTitle item={historyItem} />;

  return (
    <ChangeValueSections
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      noChangedValuesTitle={sectionTitle}
      noChangedValuesTitleTestId="LineDetails"
      current={current}
      previous={previous}
      sections={[
        {
          diffVersions: diffLine,
          sectionTitle,
          testId: 'LineDetails',
        },
      ]}
    />
  );
};
