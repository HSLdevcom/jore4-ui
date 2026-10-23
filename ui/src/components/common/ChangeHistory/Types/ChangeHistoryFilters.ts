import { Priority } from '../../../../types/enums';

export type ChangeHistoryFilters = {
  readonly from: Temporal.PlainDate;
  readonly to: Temporal.PlainDate;
  readonly priority: Priority;
};
