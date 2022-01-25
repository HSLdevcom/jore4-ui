/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

const SCHEDULED_STOP_POINT_IN_JOURNEY_PATTERN_DEFAULT_FIELDS = gql`
  fragment scheduled_stop_point_in_journey_pattern_default_fields on journey_pattern_scheduled_stop_point_in_journey_pattern {
    journey_pattern_id
    scheduled_stop_point_id
    scheduled_stop_point_sequence
    is_timing_point
    is_via_point
  }
`;

const JOURNEY_PATTERN_WITH_STOPS = gql`
  fragment journey_pattern_with_stops on journey_pattern_journey_pattern {
    journey_pattern_id
    on_route_id
    scheduled_stop_point_in_journey_patterns {
      ...scheduled_stop_point_in_journey_pattern_default_fields
      scheduled_stop_point {
        ...scheduled_stop_point_default_fields
      }
    }
  }
`;
