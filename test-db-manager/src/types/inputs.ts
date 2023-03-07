import {
  InfrastructureNetworkInfrastructureLinkInsertInput,
  JourneyPatternJourneyPatternInsertInput,
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  RouteInfrastructureLinkAlongRouteInsertInput,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  ServicePatternScheduledStopPointInsertInput,
  TimetablesJourneyPatternJourneyPatternRefInsertInput,
  TimetablesPassingTimesTimetabledPassingTimeInsertInput,
  TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput,
  TimetablesVehicleJourneyVehicleJourneyInsertInput,
  TimetablesVehicleScheduleVehicleScheduleFrameInsertInput,
  TimetablesVehicleServiceBlockInsertInput,
  TimetablesVehicleServiceVehicleServiceInsertInput,
} from '../generated/graphql';

// Make id fields required for test data insert inputs.
// By having fixed id fields we can remove test data from db
// without having to clear the whole db.

// Routes and lines

export type StopInsertInput = ServicePatternScheduledStopPointInsertInput & {
  scheduled_stop_point_id: UUID;
};

export type RouteInsertInput = RouteRouteInsertInput & { route_id: UUID };

export type LineInsertInput = RouteLineInsertInput & { line_id: UUID };

export type InfraLinkInsertInput =
  InfrastructureNetworkInfrastructureLinkInsertInput & {
    infrastructure_link_id: UUID;
  };

export type InfraLinkAlongRouteInsertInput =
  RouteInfrastructureLinkAlongRouteInsertInput & {
    infrastructure_link_id: UUID;
  };

export type JourneyPatternInsertInput =
  JourneyPatternJourneyPatternInsertInput & {
    journey_pattern_id: UUID;
  };

export type StopInJourneyPatternInsertInput =
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput & {
    journey_pattern_id: UUID;
  };

// Timetables

export type JourneyPatternRefInsertInput =
  TimetablesJourneyPatternJourneyPatternRefInsertInput;
export type JourneyPatternRefInsertInputDeep = Omit<
  JourneyPatternRefInsertInput,
  'scheduled_stop_point_in_journey_pattern_refs'
> & {
  scheduled_stop_point_in_journey_pattern_refs: {
    data: StopInJourneyPatternRefInsertInput[];
  };
};

export type StopInJourneyPatternRefInsertInput =
  TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput;

export type VehicleJourneyInsertInput =
  TimetablesVehicleJourneyVehicleJourneyInsertInput;
export type VehicleJourneyInsertInputDeep = Omit<
  VehicleJourneyInsertInput,
  'timetabled_passing_times'
> & {
  timetabled_passing_times: {
    data: TimetabledPassingTimeInsertInput[];
  };
};

export type VehicleServiceBlockInsertInput =
  TimetablesVehicleServiceBlockInsertInput;
export type BlockInsertInputDeep = Omit<
  TimetablesVehicleServiceBlockInsertInput,
  'vehicle_journeys'
> & {
  vehicle_journeys: {
    data: VehicleJourneyInsertInputDeep[];
  };
};

export type VehicleServiceInsertInput =
  TimetablesVehicleServiceVehicleServiceInsertInput;
export type VehicleServiceInsertInputDeep = Omit<
  VehicleServiceInsertInput,
  'blocks'
> & {
  blocks: {
    data: BlockInsertInputDeep[];
  };
};

export type VehicleScheduleFrameInsertInput =
  TimetablesVehicleScheduleVehicleScheduleFrameInsertInput;
export type VehicleScheduleFrameInsertInputDeep = Omit<
  VehicleScheduleFrameInsertInput,
  'vehicle_services'
> & {
  vehicle_services: {
    data: VehicleServiceInsertInputDeep[];
  };
};

export type TimetabledPassingTimeInsertInput =
  TimetablesPassingTimesTimetabledPassingTimeInsertInput;
