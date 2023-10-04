import {
  HslRouteTransportTargetEnum,
  InfrastructureNetworkDirectionEnum,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  RouteTypeOfLineEnum,
  ServicePatternScheduledStopPointInsertInput,
  TimingPatternTimingPlaceInsertInput,
} from '../generated/graphql';
import {
  LegacyHslMunicipality,
  Priority,
  StopInJourneyPatternInsertInput,
} from '../types';

export const buildLocalizedString = (str: string): LocalizedString => ({
  fi_FI: str,
  sv_FI: `${str} SV`,
});

export const buildRoute = (
  requiredFields: Pick<RouteRouteInsertInput, 'label'>,
): RouteRouteInsertInput => {
  const { label } = requiredFields;
  return {
    name_i18n: buildLocalizedString(`route ${label}`),
    description_i18n: buildLocalizedString(`description ${label}`),
    origin_name_i18n: buildLocalizedString(`origin ${label}`),
    origin_short_name_i18n: buildLocalizedString(`origin short ${label}`),
    destination_name_i18n: buildLocalizedString(`destination ${label}`),
    destination_short_name_i18n: buildLocalizedString(
      `destination short ${label}`,
    ),
    priority: Priority.Standard,
    direction: RouteDirectionEnum.Inbound,
    variant: null,
    legacy_hsl_municipality_code: LegacyHslMunicipality.Helsinki,
    ...requiredFields,
  };
};

export const buildLine = (
  requiredFields: Pick<RouteLineInsertInput, 'label'>,
): RouteLineInsertInput => {
  const { label } = requiredFields;
  return {
    name_i18n: buildLocalizedString(`line ${label}`),
    short_name_i18n: buildLocalizedString(`line short ${label}`),
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
    priority: Priority.Standard,
    transport_target: HslRouteTransportTargetEnum.HelsinkiInternalTraffic,
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: null,
    validity_end: null,
    legacy_hsl_municipality_code: LegacyHslMunicipality.Helsinki,
    ...requiredFields,
  };
};

export const buildStop = (
  requiredFields: Pick<
    ServicePatternScheduledStopPointInsertInput,
    'located_on_infrastructure_link_id' | 'label'
  >,
): ServicePatternScheduledStopPointInsertInput => ({
  measured_location: {
    type: 'Point',
    coordinates: [24.92832655782573, 60.16391811339392, 0],
  },
  direction: InfrastructureNetworkDirectionEnum.Bidirectional,
  priority: Priority.Standard,
  validity_start: null,
  validity_end: null,
  vehicle_mode_on_scheduled_stop_point: {
    data: [{ vehicle_mode: ReusableComponentsVehicleModeEnum.Bus }],
  },
  ...requiredFields,
});

export const buildStopsInJourneyPattern = (
  stopLabels: UUID[],
  journeyPatternId: UUID,
): StopInJourneyPatternInsertInput[] =>
  stopLabels.map((stopLabel, index) => ({
    journey_pattern_id: journeyPatternId,
    scheduled_stop_point_label: stopLabel,
    scheduled_stop_point_sequence: index,
    is_used_as_timing_point: false,
    is_loading_time_allowed: false,
    is_regulated_timing_point: false,
    is_via_point: false,
  }));

export const buildStopInJourneyPattern = ({
  journeyPatternId,
  stopLabel,
  scheduledStopPointSequence,
  isUsedAsTimingPoint,
  isLoadingTimeAllowed,
  isRegulatedTimingPoint,
  isViaPoint,
}: {
  journeyPatternId: UUID;
  stopLabel: UUID;
  scheduledStopPointSequence: number;
  isUsedAsTimingPoint?: boolean;
  isLoadingTimeAllowed?: boolean;
  isRegulatedTimingPoint?: boolean;
  isViaPoint?: boolean;
}): StopInJourneyPatternInsertInput => ({
  journey_pattern_id: journeyPatternId,
  scheduled_stop_point_label: stopLabel,
  scheduled_stop_point_sequence: scheduledStopPointSequence,
  is_used_as_timing_point: isUsedAsTimingPoint || false,
  is_loading_time_allowed: isLoadingTimeAllowed || false,
  is_regulated_timing_point: isRegulatedTimingPoint || false,
  is_via_point: isViaPoint || false,
});

export const buildTimingPlace = (
  id: UUID,
  label: string,
): TimingPatternTimingPlaceInsertInput => ({
  timing_place_id: id,
  label,
  description: buildLocalizedString(label),
});
