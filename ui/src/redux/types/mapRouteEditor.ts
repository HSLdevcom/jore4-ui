import { gql } from '@apollo/client';
import { JourneyPatternStopFragment } from '../../generated/graphql';

export type JourneyPattern = {
  readonly id?: UUID;
  readonly stops: ReadonlyArray<JourneyPatternStopFragment>;
};

export const GQL_JOURNEY_PATTERN_STOP = gql`
  fragment journey_pattern_stop on journey_pattern_scheduled_stop_point_in_journey_pattern {
    scheduled_stop_point_label
    scheduled_stop_point_sequence
    is_used_as_timing_point
    is_via_point
    via_point_name_i18n
    via_point_short_name_i18n
  }
`;
