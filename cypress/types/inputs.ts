import {
  InfrastructureNetworkInfrastructureLinkInsertInput,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  ServicePatternScheduledStopPointInsertInput,
} from '@hsl/jore4-test-db-manager';
import { RequiredKeys } from './types';

export type StopInsertInput = RequiredKeys<
  ServicePatternScheduledStopPointInsertInput,
  'scheduled_stop_point_id'
>;

export type RouteInsertInput = RequiredKeys<RouteRouteInsertInput, 'route_id'>;

export type LineInsertInput = RequiredKeys<RouteLineInsertInput, 'line_id'>;

export type InfraLinkInsertInput = RequiredKeys<
  InfrastructureNetworkInfrastructureLinkInsertInput,
  'infrastructure_link_id'
>;
