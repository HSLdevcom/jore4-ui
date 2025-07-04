import { gql } from '@apollo/client';

const GQL_EDIT_SCHEDULED_STOP_POINT_VALIDITY = gql`
  mutation EditScheduledStopPointValidity(
    $stopId: String!
    $priority: Int!
    $validityStart: date!
    $validityEnd: date
  ) {
    update_service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $stopId }, priority: { _eq: $priority } }
      _set: { validity_start: $validityStart, validity_end: $validityEnd }
    ) {
      returning {
        label
        priority
        stop_place_ref
        scheduled_stop_point_id
        validity_start
        validity_end
      }
    }
  }
`;
