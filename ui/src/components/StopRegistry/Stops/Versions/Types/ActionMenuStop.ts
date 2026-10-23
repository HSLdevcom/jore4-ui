import { Priority } from '../../../../../types/enums';
import { LocatableStop } from '../../../Types';

export type ActionMenuStop = LocatableStop & {
  readonly startDate: Temporal.PlainDate;
  readonly priority: Priority;
};
