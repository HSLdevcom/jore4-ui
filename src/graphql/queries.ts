/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

/*
 * Define graphql queries here and then `@graphql-codegen` can generate TypeScript code for those.
 */

const EXAMPLE_QUERY = gql`
  query MyQuery {
    infrastructure_network_direction {
      value
    }
  }
`;
