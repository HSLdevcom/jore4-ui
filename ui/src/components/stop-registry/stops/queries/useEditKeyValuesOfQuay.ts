import { gql } from '@apollo/client';

const GQL_EDIT_KEY_VALUES_OF_QUAY = gql`
  mutation EditKeyValuesOfQuay(
    $stopId: String!
    $quayId: String!
    $keyValues: [stop_registry_KeyValuesInput!]!
    $versionComment: String
  ) {
    stop_registry {
      mutateStopPlace(
        StopPlace: {
          id: $stopId
          quays: {
            id: $quayId
            keyValues: $keyValues
            versionComment: $versionComment
          }
        }
      ) {
        quays {
          publicCode
          keyValues {
            key
            values
          }
        }
      }
    }
  }
`;
