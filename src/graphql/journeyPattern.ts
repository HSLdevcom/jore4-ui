/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';
import { ServicePatternScheduledStopPoint } from '../generated/graphql';

const SCHEDULED_STOP_POINT_IN_JOURNEY_PATTERN_DEFAULT_FIELDS = gql`
  fragment scheduled_stop_point_in_journey_pattern_default_fields on journey_pattern_scheduled_stop_point_in_journey_pattern {
    journey_pattern_id
    scheduled_stop_point_label
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
      scheduled_stop_points {
        ...scheduled_stop_point_default_fields
      }
    }
  }
`;

const UPDATE_ROUTE_JOURNEY_PATTERN = gql`
  mutation UpdateRouteJourneyPattern(
    $route_id: uuid!
    $new_journey_pattern: journey_pattern_journey_pattern_insert_input!
  ) {
    delete_journey_pattern_journey_pattern(
      where: { on_route_id: { _eq: $route_id } }
    ) {
      returning {
        on_route_id
      }
    }

    insert_journey_pattern_journey_pattern_one(object: $new_journey_pattern) {
      on_route_id
    }
  }
`;

// check if the stop belongs to any of the current route's journey patterns
export const stopBelongsToJourneyPattern = (
  stop: ServicePatternScheduledStopPoint,
  routeId: UUID,
) =>
  stop.scheduled_stop_point_in_journey_patterns.some(
    (item) => item.journey_pattern?.on_route_id === routeId,
  );
