import { gql } from '@apollo/client';

const GQL_GET_QUAY = gql`
  query GetQuay($quayId: String!) {
    stop_registry {
      stopPlace(query: $quayId, onlyMonomodalStopPlaces: true) {
        ... on stop_registry_StopPlace {
          id
          version

          quays {
            id
            version

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
