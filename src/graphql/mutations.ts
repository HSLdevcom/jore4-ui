/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

/*
 * Define graphql mutations here and then `@graphql-codegen` can generate TypeScript code for those.
 */

const INSERT_POINT = gql`
  mutation InsertPoint($geojson: geography!) {
    insert_playground_points_one(object: { point_geog: $geojson }) {
      point_id
      point_geog
    }
  }
`;

const DELETE_POINT = gql`
  mutation DeletePoint($point_id: uuid!) {
    delete_playground_points_by_pk(point_id: $point_id) {
      point_id
    }
  }
`;

const UPDATE_POINT = gql`
  mutation UpdatePoint($point_id: uuid!, $geojson: geography!) {
    update_playground_points_by_pk(
      pk_columns: { point_id: $point_id }
      _set: { point_geog: $geojson }
    ) {
      point_id
      point_geog
    }
  }
`;
