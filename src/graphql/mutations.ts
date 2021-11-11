import { gql } from '@apollo/client';

/*
 * Define graphql mutations here and then `@graphql-codegen` can generate TypeScript code for those.
 */

export const INSERT_STOP = gql`
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
