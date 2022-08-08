/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';
import {
  GetRoutesBrokenByStopChangeQuery,
  InfrastructureNetworkDirectionEnum,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointSetInput,
} from '../generated/graphql';
import {
  mapFromStoreType,
  mapToStoreType,
  StoreType,
} from '../redux/utils/mappers';
import { NonNullableKeys, RequiredKeys } from '../types';
import { sortStopsOnInfraLink } from '../utils';
import { GqlQueryResult } from './types';

export type StopWithLocation = RequiredKeys<
  Partial<ServicePatternScheduledStopPoint>,
  'measured_location'
>;

// fixing the generated patching object type not to allow null values for required fields
export type ScheduledStopPointSetInput = NonNullableKeys<
  ServicePatternScheduledStopPointSetInput,
  | 'measured_location'
  | 'located_on_infrastructure_link_id'
  | 'direction'
  | 'label'
  | 'priority'
>;

const SCHEDULED_STOP_POINT_DEFAULT_FIELDS = gql`
  fragment scheduled_stop_point_default_fields on service_pattern_scheduled_stop_point {
    priority
    direction
    scheduled_stop_point_id
    label
    validity_start
    validity_end
    located_on_infrastructure_link_id
  }
`;

const SCHEDULED_STOP_POINT_ALL_FIELDS = gql`
  fragment scheduled_stop_point_all_fields on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    measured_location
    located_on_infrastructure_link_id
    direction
    relative_distance_from_infrastructure_link_start
    closest_point_on_infrastructure_link
    validity_start
    validity_end
    priority
    vehicle_mode_on_scheduled_stop_point {
      vehicle_mode
    }
  }
`;

const STOP_WITH_JOURNEY_PATTERN_FIELDS = gql`
  fragment stop_with_journey_pattern_fields on service_pattern_scheduled_stop_point {
    ...scheduled_stop_point_all_fields
    scheduled_stop_point_in_journey_patterns {
      ...scheduled_stop_point_in_journey_pattern_all_fields
    }
  }
`;

const ROUTE_STOP_FIELDS = gql`
  fragment route_stop_fields on service_pattern_scheduled_stop_point {
    ...stop_with_journey_pattern_fields
    other_label_instances {
      ...scheduled_stop_point_default_fields
    }
  }
`;

const REMOVE_STOP = gql`
  mutation RemoveStop($stop_id: uuid!) {
    delete_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stop_id } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;

const QUERY_GET_STOPS_BY_LOCATION = gql`
  query GetStopsByLocation(
    $measured_location_filter: geography_comparison_exp
  ) {
    service_pattern_scheduled_stop_point(
      where: { measured_location: $measured_location_filter }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;

const GET_STOPS_BY_VALIDITY = gql`
  query GetStopsByValidity(
    $filter: service_pattern_scheduled_stop_point_bool_exp
  ) {
    service_pattern_scheduled_stop_point(where: $filter) {
      ...scheduled_stop_point_all_fields
    }
  }
`;

const GET_STOPS_BY_IDS = gql`
  query GetStopsByIds($stopIds: [uuid!]) {
    service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _in: $stopIds } }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;

const GET_STOPS_BY_LABELS = gql`
  query GetStopsByLabels($stopLabels: [String!]) {
    service_pattern_scheduled_stop_point(
      where: { label: { _in: $stopLabels } }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;

const INSERT_STOP = gql`
  mutation InsertStop(
    $object: service_pattern_scheduled_stop_point_insert_input!
  ) {
    insert_service_pattern_scheduled_stop_point_one(object: $object) {
      scheduled_stop_point_id
      located_on_infrastructure_link_id
      direction
      priority
      measured_location
      label
      validity_start
      validity_end
    }
  }
`;

// TODO: This should also check that vehicleMode of route matches stop
// TODO: This should be combined with useExctractRouteFromFeature.ts business logics
const filterEligibleStopsOnRoute = (
  stopPoints: ServicePatternScheduledStopPoint[],
  isLinkTraversalForwards: boolean,
) =>
  stopPoints.filter(
    (stop) =>
      stop.direction === InfrastructureNetworkDirectionEnum.Bidirectional ||
      (isLinkTraversalForwards &&
        stop.direction === InfrastructureNetworkDirectionEnum.Forward) ||
      (!isLinkTraversalForwards &&
        stop.direction === InfrastructureNetworkDirectionEnum.Backward),
  );

export const getEligibleStopsAlongRouteGeometry = (route: RouteRoute) => {
  return route.infrastructure_links_along_route.flatMap((infraLink, index) => {
    const isLinkTraversalForwards =
      route.infrastructure_links_along_route[index].is_traversal_forwards;
    const eligibleStops = filterEligibleStopsOnRoute(
      infraLink.infrastructure_link
        .scheduled_stop_points_located_on_infrastructure_link,
      isLinkTraversalForwards,
    );
    const sortedEligibleStops = sortStopsOnInfraLink(
      eligibleStops,
      isLinkTraversalForwards,
    );

    return sortedEligibleStops;
  });
};

const EDIT_STOP = gql`
  mutation EditStop(
    $stop_id: uuid!
    $stop_label: String!
    $stop_patch: service_pattern_scheduled_stop_point_set_input!
    $delete_from_journey_pattern_ids: [uuid!]!
  ) {
    # edit the stop itself
    update_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stop_id } }
      _set: $stop_patch
    ) {
      returning {
        ...scheduled_stop_point_all_fields
      }
    }

    # delete the stop from the following journey patterns
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        _and: {
          scheduled_stop_point_label: { _eq: $stop_label }
          journey_pattern_id: { _in: $delete_from_journey_pattern_ids }
        }
      }
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
`;

const GET_STOP_WITH_ROUTE_GRAPH_DATA_BY_ID = gql`
  query GetStopWithRouteGraphDataById($stopId: uuid!) {
    service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stopId } }
    ) {
      ...scheduled_stop_point_all_fields
      scheduled_stop_point_in_journey_patterns {
        ...scheduled_stop_point_in_journey_pattern_all_fields
        journey_pattern {
          journey_pattern_id
          journey_pattern_route {
            ...route_default_fields
            infrastructure_links_along_route {
              route_id
              infrastructure_link_id
              infrastructure_link_sequence
            }
          }
        }
      }
    }
  }
`;

export const mapStopToStoreStop = (
  stop: StopWithLocation,
): StoreType<StopWithLocation> =>
  mapToStoreType(stop, ['validity_start', 'validity_end']);

export const mapStoreStopToStop = (
  stop: StoreType<StopWithLocation>,
): StopWithLocation =>
  mapFromStoreType(stop, ['validity_start', 'validity_end']);

const GET_ROUTES_BROKEN_BY_STOP_CHANGE = gql`
  query GetRoutesBrokenByStopChange(
    $new_located_on_infrastructure_link_id: uuid!
    $new_direction: String!
    $new_label: String!
    $new_validity_start: timestamptz
    $new_validity_end: timestamptz
    $new_priority: Int!
    $new_measured_location: geography!
    $replace_scheduled_stop_point_id: uuid
  ) {
    journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point(
      args: {
        replace_scheduled_stop_point_id: $replace_scheduled_stop_point_id
        new_located_on_infrastructure_link_id: $new_located_on_infrastructure_link_id
        new_direction: $new_direction
        new_label: $new_label
        new_validity_start: $new_validity_start
        new_validity_end: $new_validity_end
        new_priority: $new_priority
        new_measured_location: $new_measured_location
      }
    ) {
      journey_pattern_id
      journey_pattern_route {
        ...route_all_fields
      }
    }
  }
`;

export const mapGetRoutesBrokenByStopChangeResult = (
  result: GqlQueryResult<GetRoutesBrokenByStopChangeQuery>,
) =>
  result.data
    ?.journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point;
