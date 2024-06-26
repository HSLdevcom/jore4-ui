/* eslint-disable @typescript-eslint/no-unused-vars */

import { gql } from '@apollo/client';

const QUERY_GET_STOP_AREAS_BY_LOCATION = gql`
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

    from_date
    to_date

    name_lang
    name_value

    alternative_names: group_of_stop_places_alternative_names {
      group_of_stop_places_id
      alternative_names_id
      alternative_name {
        id
        name_value
        name_lang
      }
    }

    members: group_of_stop_places_members {
      group_of_stop_places_id
      ref
      version

      stop_place: stop_place_newest_version {
        ...member_stop_fields
      }
    }
  }

  fragment member_stop_fields on stops_database_stop_place_newest_version {
    id
    netex_id
    centroid
  }
`;

const GET_SCHEDULED_STOP_POINT_BY_STOP_PLACE_REF = gql`
  query GetScheduledStopPointByStopPlaceRef($stopPlaceRef: String!) {
    service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $stopPlaceRef } }
      limit: 1 # stop_place_ref is UNIQUE in the DB
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;
