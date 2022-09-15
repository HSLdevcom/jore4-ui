import { gql } from '@apollo/client';
import {
  JourneyPatternStopFragment,
  RouteStopFieldsFragment,
} from '../../generated/graphql';
import { RouteInfraLink } from '../../graphql';
import { StoreType } from '../mappers/storeType';

export interface RouteGeometry {
  stopsEligibleForJourneyPattern: StoreType<RouteStopFieldsFragment>[];
  includedStopLabels: string[];
  journeyPatternStops: JourneyPatternStopFragment[];
  infraLinksAlongRoute: RouteInfraLink[];
}

export const GQL_JOURNEY_PATTERN_STOP = gql`
  fragment journey_pattern_stop on journey_pattern_scheduled_stop_point_in_journey_pattern {
    scheduled_stop_point_label
    is_timing_point
    is_via_point
    via_point_name_i18n
    via_point_short_name_i18n
  }
`;
