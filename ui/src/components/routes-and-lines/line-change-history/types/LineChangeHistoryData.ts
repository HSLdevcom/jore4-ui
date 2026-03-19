import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
} from '../../../../generated/graphql';

export type RouteStopData = {
  readonly is_loading_time_allowed: boolean;
  readonly is_regulated_timing_point: boolean;
  readonly is_used_as_timing_point: boolean;
  readonly is_via_point: boolean;
  readonly journey_pattern_id: UUID;
  readonly scheduled_stop_point_sequence: number;
  readonly scheduled_stop_point_label: string;
  readonly via_point_name_i18n: LocalizedString | null;
  readonly via_point_short_name_i18n: LocalizedString | null;
};

export type RouteData = {
  readonly description_i18n: LocalizedString | null;
  readonly destination_name_i18n: LocalizedString | null;
  readonly destination_short_name_i18n: LocalizedString | null;
  readonly direction: RouteDirectionEnum;
  readonly label: string;
  readonly legacy_hsl_municipality_code: string | null;
  readonly name_i18n: LocalizedString;
  readonly on_line_id: UUID;
  readonly origin_name_i18n: LocalizedString | null;
  readonly origin_short_name_i18n: LocalizedString | null;
  readonly priority: number;
  readonly route_id: UUID;
  readonly unique_label: string;
  readonly validity_end: string | null;
  readonly validity_start: string | null;
  readonly variant: number | null;
  readonly version_comment: string | null;

  readonly stops: ReadonlyArray<RouteStopData>;
  readonly estimated_length_in_metres: number | null;
};

export type LineData = {
  readonly description: string | null;
  readonly label: string;
  readonly legacy_hsl_municipality_code: string | null;
  readonly line_id: UUID;
  readonly name_i18n: LocalizedString;
  readonly primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
  readonly priority: number;
  readonly short_name_i18n: LocalizedString;
  readonly transport_target: HslRouteTransportTargetEnum;
  readonly type_of_line: RouteTypeOfLineEnum;
  readonly validity_end: string | null;
  readonly validity_start: string | null;
  readonly version_comment: string | null;

  readonly routes: ReadonlyArray<RouteData>;
};
