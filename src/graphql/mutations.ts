/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

/*
 * Define graphql mutations here and then `@graphql-codegen` can generate TypeScript code for those.
 */

const INSERT_STOP = gql`
  mutation InsertStop(
    $object: service_pattern_scheduled_stop_point_insert_input!
  ) {
    insert_service_pattern_scheduled_stop_point_one(object: $object) {
      scheduled_stop_point_id
      located_on_infrastructure_link_id
      direction
      measured_location
      label
    }
  }
`;

const INSERT_ROUTE = gql`
  mutation InsertRouteOne($object: route_route_insert_input!) {
    insert_route_route_one(object: $object) {
      starts_from_scheduled_stop_point_id
      ends_at_scheduled_stop_point_id
      route_shape
      on_line_id
      priority
      label
      direction
    }
  }
`;

const INSERT_LINE = gql`
  mutation InsertLineOne($object: route_line_insert_input!) {
    insert_route_line_one(object: $object) {
      label
      priority
      primary_vehicle_mode
    }
  }
`;
