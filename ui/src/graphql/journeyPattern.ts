/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';
import {
  GetScheduledStopPointWithViaInfoQuery,
  JourneyPatternScheduledStopPointInJourneyPattern,
  StopWithJourneyPatternFieldsFragment,
} from '../generated/graphql';
import { GqlQueryResult } from './types';

const SCHEDULED_STOP_POINT_IN_JOURNEY_PATTERN_ALL_FIELDS = gql`
  fragment scheduled_stop_point_in_journey_pattern_all_fields on journey_pattern_scheduled_stop_point_in_journey_pattern {
    journey_pattern_id
    scheduled_stop_point_label
    scheduled_stop_point_sequence
    is_used_as_timing_point
    is_regulated_timing_point
    is_loading_time_allowed
    is_via_point
    via_point_name_i18n
    via_point_short_name_i18n
    journey_pattern {
      journey_pattern_id
      on_route_id
    }
  }
`;

const JOURNEY_PATTERN_WITH_STOPS = gql`
  fragment journey_pattern_with_stops on journey_pattern_journey_pattern {
    journey_pattern_id
    on_route_id
    ordered_scheduled_stop_point_in_journey_patterns: scheduled_stop_point_in_journey_patterns(
      order_by: { scheduled_stop_point_sequence: asc }
    ) {
      ...scheduled_stop_point_in_journey_pattern_all_fields
      scheduled_stop_points {
        ...scheduled_stop_point_default_fields
      }
    }
  }
`;

// check if the stop belongs to any of the current route's journey patterns
export const stopBelongsToJourneyPattern = (
  stop: StopWithJourneyPatternFieldsFragment,
  routeId: UUID,
) =>
  stop.scheduled_stop_point_in_journey_patterns.some(
    (item) => item.journey_pattern?.on_route_id === routeId,
  );

const PATCH_SCHEDULED_STOP_POINT_VIA_INFO = gql`
  mutation PatchScheduledStopPointViaInfo(
    $stopLabel: String!
    $journeyPatternId: uuid!
    $patch: journey_pattern_scheduled_stop_point_in_journey_pattern_set_input!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: $patch
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
`;

const REMOVE_SCHEDULED_STOP_POINT_VIA_INFO = gql`
  mutation RemoveScheduledStopPointViaInfo(
    $stopLabel: String!
    $journeyPatternId: uuid!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: {
        is_via_point: false
        via_point_name_i18n: null
        via_point_short_name_i18n: null
      }
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
`;

const GET_SCHEDULED_STOP_POINT_WITH_VIA_INFO = gql`
  query GetScheduledStopPointWithViaInfo(
    $journeyPatternId: uuid!
    $stopLabel: String!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
      }
    ) {
      ...scheduled_stop_point_in_journey_pattern_all_fields
      journey_pattern {
        journey_pattern_id
        journey_pattern_route {
          route_id
          label
        }
      }
    }
  }
`;

export const mapGetScheduledStopPointWithViaInfo = (
  result: GqlQueryResult<GetScheduledStopPointWithViaInfoQuery>,
) =>
  result.data?.journey_pattern_scheduled_stop_point_in_journey_pattern[0] as
    | JourneyPatternScheduledStopPointInJourneyPattern
    | undefined;
