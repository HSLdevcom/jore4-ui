import { FC } from 'react';
import { TodaysNameForQuay } from '../types';

const testIds = {
  names: 'StopChangeHistoryPage::names',
};

type StopChangeHistoryNamesProps = {
  readonly names: TodaysNameForQuay;
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
