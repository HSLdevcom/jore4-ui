import { DateTime } from 'luxon';
import { Priority } from './enums';

export type FilterableStopInfo = {
  readonly label: string;
  readonly priority: Priority;
  readonly scheduled_stop_point_id: UUID;
  readonly validity_start?: DateTime | null;
  readonly validity_end?: DateTime | null;
};
