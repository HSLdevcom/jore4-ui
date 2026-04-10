import { FC } from 'react';
import { TodaysName } from '../types';

const testIds = {
  names: 'StopChangeHistoryPage::Names',
};

type StopChangeHistoryNamesProps = {
  readonly names: TodaysName;
};

export const StopChangeHistoryNames: FC<StopChangeHistoryNamesProps> = ({
  names,
}) =>
  names.name && (
    <h2 data-testid={testIds.names}>
      <span>{names.name}</span>
      {' - '}
      <span>{names.nameSwe}</span>
    </h2>
  );
