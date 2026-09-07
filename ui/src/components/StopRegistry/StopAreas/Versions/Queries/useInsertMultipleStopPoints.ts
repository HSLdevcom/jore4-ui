import { gql } from '@apollo/client';

const GQL_INSERT_STOP_POINTS = gql`
  mutation InsertMultipleStopPoints(
    $stopPoints: [service_pattern_scheduled_stop_point_insert_input!]!
  ) {
    stopPoints: insert_service_pattern_scheduled_stop_point(
      objects: $stopPoints
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
