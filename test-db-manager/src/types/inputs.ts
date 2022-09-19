// graphql schema uses snake_case instead of camelCase
/* eslint-disable camelcase */
import {
  InfrastructureNetworkInfrastructureLinkInsertInput,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  ServicePatternScheduledStopPointInsertInput,
} from '../generated/graphql';

// Make id fields required for test data insert inputs.
// By having fixed id fields we can remove test data from db
// without having to clear the whole db.

export type StopInsertInput = ServicePatternScheduledStopPointInsertInput & {
  scheduled_stop_point_id: UUID;
};

export type RouteInsertInput = RouteRouteInsertInput & { route_id: UUID };

export type LineInsertInput = RouteLineInsertInput & { line_id: UUID };

export type InfraLinkInsertInput =
  InfrastructureNetworkInfrastructureLinkInsertInput & {
    infrastructure_link_id: UUID;
  };
