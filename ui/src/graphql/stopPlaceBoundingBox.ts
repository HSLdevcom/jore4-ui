import { gql } from '@apollo/client';
import {
  QuayDetailsFragment,
  ScheduledStopPointAllFieldsFragment,
  StopPlaceDetailsFragment,
} from '../generated/graphql';

export type StopPlaceBoundingBox = Readonly<StopPlaceDetailsFragment & {
  stopPoint: ScheduledStopPointAllFieldsFragment;
  quays: QuayDetailsFragment[];
}>


export const QUERY_STOP_PLACE_BOUNDING_BOXES = gql`
  query GetStopPlacesByBoundingBoxes(
    $latMax: stop_registry_BigDecimal!
    $latMin: stop_registry_BigDecimal!
    $lonMax: stop_registry_BigDecimal!
    $lonMin: stop_registry_BigDecimal!
  ) {
    stop_registry {
      stopPlace: stopPlaceBBox(
        latMax: $latMax
        latMin: $latMin
        lonMax: $lonMax
        lonMin: $lonMin
      ) {
        ...stop_place_details
        ... on stop_registry_StopPlace {
          scheduled_stop_point {
            ...scheduled_stop_point_all_fields
          }
          quays {
            ...quay_details
          }
        }
      }
    }
  }
`;
