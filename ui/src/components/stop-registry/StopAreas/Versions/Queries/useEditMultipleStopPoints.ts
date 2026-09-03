import { gql } from '@apollo/client';

const GQL_EDIT_MULTIPLE_STOP_POINTS = gql`
  mutation EditMultipleStopPoints(
    $updates: [service_pattern_scheduled_stop_point_updates!]!
  ) {
    stopPoints: update_service_pattern_scheduled_stop_point_many(
      updates: $updates
    ) {
      returning {
        scheduled_stop_point_id
        located_on_infrastructure_link_id
        direction
        priority
        measured_location
        label
        validity_start
        validity_end
        stop_place_ref
      }
    }
  }
`;
