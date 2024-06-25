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

      stop_place {
        ...member_stop_fields
      }
    }
  }

  fragment member_stop_fields on stops_database_stop_place {
    id
    netex_id
    centroid
  }
`;
