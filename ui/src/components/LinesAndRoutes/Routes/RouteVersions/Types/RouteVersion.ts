import { LineString } from 'geojson';
import { RouteDirectionEnum } from '../../../../../generated/graphql';
import { Priority } from '../../../../../types/enums';
import { VersionStatus } from '../../../../common/Versions';

export type RouteVersion = {
  readonly route_id: UUID;
  readonly id: UUID;
  readonly label: string;
  readonly direction: RouteDirectionEnum;
  readonly variant: number | null;
  readonly validity_start: Temporal.PlainDate;
  readonly validity_end: Temporal.PlainDate | null;
  readonly priority: Priority;
  readonly status: VersionStatus;
  readonly version_comment: string;
  readonly lineName: string;
  readonly lineLabel: string;
  readonly changed: Temporal.ZonedDateTime | null;
  readonly changedByUserName: string | null;
  readonly route_shape: LineString | null | undefined; // GeoJSON geometry
};
