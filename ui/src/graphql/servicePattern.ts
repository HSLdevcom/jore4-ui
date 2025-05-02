/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';
import {
  GetRoutesBrokenByStopChangeQuery,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointSetInput,
} from '../generated/graphql';
import { NonNullableKeys, RequiredKeys } from '../types';
import { GqlQueryResult, isGqlEntity } from './types';

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

// Copy of ScheduledStopPointSetInput that can be used for update scenarios,
// when it is not necessary to always update the non-nullable fields.
export type PartialScheduledStopPointSetInput =
  Partial<ScheduledStopPointSetInput>;

const SCHEDULED_STOP_POINT_DEFAULT_FIELDS = gql`
  fragment scheduled_stop_point_default_fields on service_pattern_scheduled_stop_point {
    priority
    direction
    scheduled_stop_point_id
    label
    timing_place_id
    timing_place {
      timing_place_id
      label
    }
    validity_start
    validity_end
    located_on_infrastructure_link_id
    stop_place_ref
    stop_place {
      name {
        lang
        value
      }
    }
  }
`;

const SCHEDULED_STOP_POINT_ALL_FIELDS = gql`
  fragment scheduled_stop_point_all_fields on service_pattern_scheduled_stop_point {
    ...scheduled_stop_point_default_fields
    measured_location
    relative_distance_from_infrastructure_link_start
    closest_point_on_infrastructure_link
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

export const mapGetRoutesBrokenByStopChangeResult = (
  result: GqlQueryResult<GetRoutesBrokenByStopChangeQuery>,
) =>
  result.data
    ?.journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point ??
  [];

export const isStop = (
  input: unknown,
): input is ServicePatternScheduledStopPoint => {
  return (
    isGqlEntity(input) &&
    // eslint-disable-next-line no-underscore-dangle
    input.__typename === 'service_pattern_scheduled_stop_point'
  );
};
