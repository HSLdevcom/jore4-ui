import { gql } from '@apollo/client';
import { Position } from '@turf/helpers';
import {
  StopRegistryGeoJsonType,
  useInsertStopPlaceMutation,
} from '../../generated/graphql';

export interface InsertStopPlaceInput {
  label: string;
  coordinates: Position;
}

const GQL_INSERT_STOP_PLACE = gql`
  mutation InsertStopPlace($object: stop_registry_StopPlaceInput) {
    stop_registry {
      mutateStopPlace(StopPlace: $object) {
        publicCode
        id
        quays {
          publicCode
        }
      }
    }
  }
`;

export const useCreateStopPlace = () => {
  const [insertStopPlaceMutation] = useInsertStopPlaceMutation();

  const mapToInsertStopPlaceVariables = ({
    label,
    coordinates,
  }: InsertStopPlaceInput) => ({
    variables: {
      object: {
        // TODO: change the name to the actual name after we add the inputs for it.
        // For now we use label as placeholder so that we can create the tiamat instance of the stop
        name: { lang: 'fin', value: label },
        quays: [{ publicCode: label }],
        geometry: {
          // Tiamat does not support altitude, and currently breaks quite badly if one attempts to persist it.
          coordinates: coordinates.slice(0, 2),
          type: StopRegistryGeoJsonType.Point,
        },
      },
    },
  });

  return {
    mapToInsertStopPlaceVariables,
    insertStopPlaceMutation,
  };
};
