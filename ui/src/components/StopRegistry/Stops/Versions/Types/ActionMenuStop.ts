import { DateTime } from 'luxon';
import { Priority } from '../../../../../types/enums';
import { LocatableStop } from '../../../Types';

export type ActionMenuStop = LocatableStop & {
  readonly startDate: DateTime;
  readonly priority: Priority;
};
