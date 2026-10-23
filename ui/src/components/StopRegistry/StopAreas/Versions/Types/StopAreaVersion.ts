import { DateTime } from 'luxon';
import { Point } from '../../../../../types';

export type StopAreaVersion = {
  readonly id: number;
  readonly netex_id: string;
  readonly private_code: string;
  readonly name: string;

  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;

  readonly location: Point;

  readonly created: Temporal.ZonedDateTime;
  readonly changed: Temporal.ZonedDateTime;
  readonly changed_by: string;
  readonly version_comment: string;
};
