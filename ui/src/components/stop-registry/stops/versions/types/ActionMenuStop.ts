import { DateTime } from 'luxon';
import { LocatableStop } from '../../../types';

export type ActionMenuStop = LocatableStop & {
  readonly startDate: DateTime;
}
