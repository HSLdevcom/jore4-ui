import { DateTime } from 'luxon';
import { Point } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { StopVersionStatus } from './StopVersionStatus';

export type StopVersion = {
  readonly id: number;
  readonly netex_id: string;
  readonly stop_place_netex_id: string;
  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;
  readonly priority: Priority;
  readonly status: StopVersionStatus;
  readonly location: Point;
  readonly changed: DateTime;
  readonly changed_by: string;
  readonly version_comment: string;
};
