import { gql } from '@apollo/client';

const GQL_QUERY_GET_STOP_AREAS_BY_LOCATION = gql`
  query GetStopAreasByLocation(
    $measured_location_filter: geometry_comparison_exp
  ) {
    stops_database {
      areas: stops_database_group_of_stop_places(
        where: {
          centroid: $measured_location_filter
          netex_id: { _is_null: false }
        }
      ) {
        ...stop_area_minimal_show_on_map_fields
      }
    }
  }

  fragment stop_area_minimal_show_on_map_fields on stops_database_group_of_stop_places {
    id
    netex_id
    centroid
  }
`;

const GQL_GET_STOP_AREA_BY_ID = gql`
  fragment stop_area_form_fields on stop_registry_GroupOfStopPlaces {
    id
    name {
      lang
      value
    }
    description {
      lang
      value
    }
    geometry {
      coordinates
      type
    }
    validBetween {
      fromDate
      toDate
    }
    members {
      id
      name {
        value
        lang
      }
      geometry {
        coordinates
        type
      }
    }
  }

  query GetStopAreaById($stopAreaId: String!) {
    stop_registry {
      groupOfStopPlaces(id: $stopAreaId) {
        ...stop_area_form_fields
      }
    }
  }
`;

const GQL_GET_SCHEDULED_STOP_POINT_BY_STOP_PLACE_REF = gql`
  query GetScheduledStopPointByStopPlaceRef($stopPlaceRef: String!) {
    service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $stopPlaceRef } }
      limit: 1 # stop_place_ref is UNIQUE in the DB
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;
