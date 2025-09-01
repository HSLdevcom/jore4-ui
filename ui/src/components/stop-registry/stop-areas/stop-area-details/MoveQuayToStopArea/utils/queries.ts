import { gql } from '@apollo/client';

const GQL_MOVE_QUAY_TO_STOP_PLACE = gql`
  mutation moveQuayToStopPlace(
    $toStopPlaceId: String!
    $quayIds: [String!]!
    $moveQuayFromDate: stop_registry_LocalDate!
    $fromVersionComment: String!
    $toVersionComment: String!
  ) {
    stop_registry {
      moveQuaysToStop(
        toStopPlaceId: $toStopPlaceId
        quayIds: $quayIds
        moveQuayFromDate: $moveQuayFromDate
        fromVersionComment: $fromVersionComment
        toVersionComment: $toVersionComment
      ) {
        ... on stop_registry_StopPlace {
          id
          version
          versionComment
          quays {
            id
            publicCode
            keyValues {
              key
              values
            }
          }
        }
      }
    }
  }
`;

const GQL_GET_STOP_POINTS_BY_QUAY_ID = gql`
  query GetStopPointsByQuayId($quayIds: [String!]!) {
    service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _in: $quayIds } }
    ) {
      scheduled_stop_point_id
      priority
      direction
      label
      timing_place_id
      validity_start
      validity_end
      located_on_infrastructure_link_id
      stop_place_ref
      measured_location
      vehicle_mode_on_scheduled_stop_point {
        vehicle_mode
      }
    }
  }
`;

const GQL_UPDATE_STOP_POINT = gql`
  mutation UpdateStopPoint(
    $stopId: uuid!
    $changes: service_pattern_scheduled_stop_point_set_input!
  ) {
    update_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stopId } }
      _set: $changes
    ) {
      returning {
        scheduled_stop_point_id
        validity_end
      }
    }
  }
`;

const GQL_GET_ORIGINAL_QUAYS = gql`
  query GetOriginalQuays($quayId: String!) {
    stop_registry {
      stopPlace(query: $quayId, onlyMonomodalStopPlaces: true) {
        ... on stop_registry_StopPlace {
          quays {
            id
            publicCode
          }
        }
      }
    }
  }
`;
