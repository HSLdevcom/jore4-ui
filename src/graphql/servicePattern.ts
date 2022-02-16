/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

const SCHEDULED_STOP_POINT_DEFAULT_FIELDS = gql`
  fragment scheduled_stop_point_default_fields on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    validity_start
    validity_end
    measured_location
    vehicle_mode_on_scheduled_stop_point {
      vehicle_mode
    }
  }
`;

const REMOVE_STOP = gql`
  mutation RemoveStop($id: uuid!) {
    delete_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $id } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;
