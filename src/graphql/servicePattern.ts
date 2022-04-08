/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloQueryResult, gql } from '@apollo/client';
import {
  GetStopByIdQuery,
  GetStopsAlongInfrastructureLinksQuery,
  GetStopWithRouteGraphDataByIdQuery,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointSetInput,
  useGetStopsQuery,
} from '../generated/graphql';
import { NonNullableKeys, RequiredKeys } from '../types';
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
    scheduled_stop_point_id
    label
    validity_start
    validity_end
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

const QUERY_GET_ALL_STOPS = gql`
  query GetStops {
    service_pattern_scheduled_stop_point {
      ...scheduled_stop_point_all_fields
    }
  }
`;
export const mapGetStopsResult = (
  result:
    | ReturnType<typeof useGetStopsQuery>
    | ApolloQueryResult<GetStopsAlongInfrastructureLinksQuery>,
) =>
  result.data?.service_pattern_scheduled_stop_point as
    | ServicePatternScheduledStopPoint[]
    | undefined;

const GET_STOP_BY_ID = gql`
  query GetStopById($stopId: uuid!) {
    service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stopId } }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;
export const mapGetStopByIdResult = (
  result: GqlQueryResult<GetStopByIdQuery>,
) =>
  result.data?.service_pattern_scheduled_stop_point[0] as
    | ServicePatternScheduledStopPoint
    | undefined;

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

export const getStopsAlongRouteGeometry = (route: RouteRoute) => {
  return route.infrastructure_links_along_route.flatMap(
    (infraLink) =>
      infraLink.infrastructure_link
        .scheduled_stop_point_located_on_infrastructure_link,
  );
};

const EDIT_STOP = gql`
  mutation EditStop(
    $stop_id: uuid!
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
          scheduled_stop_point_id: { _eq: $stop_id }
          journey_pattern_id: { _in: $delete_from_journey_pattern_ids }
        }
      }
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_default_fields
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
        ...scheduled_stop_point_in_journey_pattern_default_fields
        journey_pattern {
          journey_pattern_id
          journey_pattern_route {
            ...route_default_fields
            infrastructure_links_along_route {
              infrastructure_link_id
            }
          }
        }
      }
    }
  }
`;

export const mapGetStopWithRouteGraphDataByIdResult = (
  result: GqlQueryResult<GetStopWithRouteGraphDataByIdQuery>,
) =>
  result.data?.service_pattern_scheduled_stop_point?.[0] as
    | ServicePatternScheduledStopPoint
    | undefined;
