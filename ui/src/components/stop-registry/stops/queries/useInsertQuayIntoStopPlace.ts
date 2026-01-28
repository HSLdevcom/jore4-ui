import { gql } from '@apollo/client';

const GQL_INSERT_QUAY_INTO_STOP_PLACE = gql`
  mutation InsertQuayIntoStopPlace(
    $stopPlaceId: String!
    $quayInput: stop_registry_QuayInput!
  ) {
    stop_registry {
      mutateStopPlace(StopPlace: { id: $stopPlaceId, quays: [$quayInput] }) {
        id
        version

        quays {
          id
          version

          # Get keyValues to match the inserted Quay based on the 'imported-id'
          keyValues {
            key
            values
          }
        }
      }
    }
  }
`;
