/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

/*
 * Define graphql queries here and then `@graphql-codegen` can generate TypeScript code for those.
 */

const QUERY_CLOSEST_LINK = gql`
  query QueryClosestLink($point: geography) {
    infrastructure_network_resolve_point_to_closest_link(
      args: { geog: $point }
    ) {
      infrastructure_link_id
    }
  }
`;

const LIST_ALL_LINES = gql`
  query ListAllLines {
    route_line {
      line_id
      name_i18n
      short_name_i18n
      description_i18n
      primary_vehicle_mode
    }
  }
`;
