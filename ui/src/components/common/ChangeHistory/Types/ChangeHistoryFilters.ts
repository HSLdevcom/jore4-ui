import { DateTime } from 'luxon';
import { Priority } from '../../../../types/enums';

export type ChangeHistoryFilters = {
  readonly from: DateTime;
  readonly to: DateTime;
  readonly priority: Priority;
};
