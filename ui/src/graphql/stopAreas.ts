import { gql } from '@apollo/client';

const GQL_QUERY_GET_STOP_AREAS_BY_LOCATION = gql`
  query GetStopAreasByLocation(
    $measured_location_filter: geometry_comparison_exp
  ) {
    stops_database {
      areas: stops_database_stop_place_newest_version(
        where: {
          centroid: $measured_location_filter
          netex_id: { _is_null: false }
          parent_stop_place: { _eq: false }
        }
      ) {
        ...stop_area_minimal_show_on_map_fields
      }
    }
  }

  fragment stop_area_minimal_show_on_map_fields on stops_database_stop_place_newest_version {
    id
    netex_id
    centroid
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
