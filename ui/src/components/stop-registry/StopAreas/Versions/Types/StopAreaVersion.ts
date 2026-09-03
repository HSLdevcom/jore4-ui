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

  readonly created: DateTime;
  readonly changed: DateTime;
  readonly changed_by: string;
  readonly version_comment: string;
};
