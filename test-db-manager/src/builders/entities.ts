import {
  HslRouteTransportTargetEnum,
  InfrastructureNetworkDirectionEnum,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  RouteTypeOfLineEnum,
  ServicePatternScheduledStopPointInsertInput,
} from '../generated/graphql';
import { Priority, StopInJourneyPatternInsertInput } from '../types';

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
    type_of_line: RouteTypeOfLineEnum.RegionalBusService,
    validity_start: null,
    validity_end: null,
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
    is_timing_point: true,
    is_via_point: false,
  }));
