/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

/*
 * Define graphql subscrptions here and then `@graphql-codegen` can generate TypeScript code for those.
 */

const SUBSCRIBE_ALL_POINTS = gql`
  subscription SubscribeAllPoints {
    playground_points {
      point_geog
      point_id
    }
  }
`;
