import { LineString } from 'geojson';
import { DateTime } from 'luxon';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { Priority } from '../../../../types/enums';
import { VersionStatus } from '../../../common';

export type RouteVersion = {
  readonly route_id: UUID;
  readonly id: UUID;
  readonly label: string;
  readonly direction: RouteDirectionEnum;
  readonly variant: number | null;
  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;
  readonly priority: Priority;
  readonly status: VersionStatus;
  readonly version_comment: string;
  readonly lineName: string;
  readonly lineLabel: string;
  readonly changed: DateTime | null;
  readonly changedByUserName: string | null;
  readonly route_shape: LineString | null | undefined; // GeoJSON geometry
};
