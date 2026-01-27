import { DateTime } from 'luxon';
import { Point } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { StopVersionStatus } from './StopVersionStatus';

export type StopVersion = {
  readonly id: number;
  readonly public_code: string;
  readonly netex_id: string;
  readonly stop_place_netex_id: string;
  readonly stop_place_name: string;
  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;
  readonly priority: Priority;
  readonly status: StopVersionStatus;
  readonly location: Point;
  readonly changed: string;
  readonly changedByUserName: string | null;
  readonly version_comment: string;
};
