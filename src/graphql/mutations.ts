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
