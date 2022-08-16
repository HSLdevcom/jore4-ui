import { DateTime } from 'luxon';
import {
  HslRouteTransportTargetEnum,
  InfrastructureNetworkDirectionEnum,
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  ReusableComponentsVehicleModeEnum,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  RouteTypeOfLineEnum,
  ServicePatternScheduledStopPointInsertInput,
} from '../generated/graphql';
import { Priority } from '../types';

export const buildLocalizedString = (str: string): LocalizedString => ({
  fi_FI: str,
  sv_FI: `${str} SV`,
});

export const buildRoute = (
  requiredFields: Pick<RouteRouteInsertInput, 'label'>,
): RouteRouteInsertInput => ({
  name_i18n: buildLocalizedString(`route ${requiredFields.label}`),
  description_i18n: buildLocalizedString(`description ${requiredFields.label}`),
  origin_name_i18n: buildLocalizedString(`origin ${requiredFields.label}`),
  origin_short_name_i18n: buildLocalizedString(
    `origin short ${requiredFields.label}`,
  ),
  destination_name_i18n: buildLocalizedString(
    `destination ${requiredFields.label}`,
  ),
  destination_short_name_i18n: buildLocalizedString(
    `destination short ${requiredFields.label}`,
  ),
  ...requiredFields,
});

export const buildLine = (
  requiredFields: Pick<RouteLineInsertInput, 'label'>,
): RouteLineInsertInput => ({
  name_i18n: buildLocalizedString(`line ${requiredFields.label}`),
  short_name_i18n: buildLocalizedString(`line short ${requiredFields.label}`),
  primary_vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
  priority: Priority.Standard,
  transport_target: HslRouteTransportTargetEnum.HelsinkiInternalTraffic,
  type_of_line: RouteTypeOfLineEnum.RegionalBusService,
  validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
  validity_end: null,
  ...requiredFields,
});

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
): JourneyPatternScheduledStopPointInJourneyPatternInsertInput[] =>
  stopLabels.map((stopLabel, index) => ({
    journey_pattern_id: journeyPatternId,
    scheduled_stop_point_label: stopLabel,
    scheduled_stop_point_sequence: index,
    is_timing_point: true,
    is_via_point: false,
  }));
