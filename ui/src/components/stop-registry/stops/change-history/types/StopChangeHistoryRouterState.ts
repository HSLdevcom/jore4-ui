import { DateTime } from 'luxon';
import { Priority } from '../../../../../types/enums';

export type StopChangeHistoryFilters = {
  readonly from: DateTime;
  readonly to: DateTime;
  readonly priority: Priority;
};

export type StopChangeHistoryRouterState = {
  readonly filters: StopChangeHistoryFilters;
};
