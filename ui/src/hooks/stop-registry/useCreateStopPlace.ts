import { gql } from '@apollo/client';
import { Position } from '@turf/helpers';
import {
  StopRegistryGeoJsonType,
  useInsertStopPlaceMutation,
} from '../../generated/graphql';

export interface CreateTiamatChanges {
  label: string;
  coordinates: Position;
}

const GQL_INSERT_STOP_PLACE = gql`
  mutation InsertStopPlace($objects: stop_registry_StopPlaceInput) {
    stop_registry {
      mutateStopPlace(StopPlace: $objects) {
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

  const mapCreateChangesToTiamatVariables = (changes: CreateTiamatChanges) => ({
    variables: {
      objects: {
        // TODO: change the name to the actual name after we add the inputs for it.
        // For now we use label as placeholder so that we can create the tiamat instance of the stop
        name: { lang: 'fin', value: changes.label },
        quays: [{ publicCode: changes.label }],
        geometry: {
          // Due to tiamat reasons, we need to wrap the coordinates in an array.
          coordinates: [changes.coordinates],
          type: StopRegistryGeoJsonType.Point,
        },
      },
    },
  });

  return {
    mapCreateChangesToTiamatVariables,
    insertStopPlaceMutation,
  };
};
