import { gql } from '@apollo/client';
import { Position } from 'geojson';
import { DateTime } from 'luxon';
import {
  InsertStopPlaceMutationVariables,
  useInsertStopPlaceMutation,
} from '../../generated/graphql';
import { Priority } from '../../types/enums';
import { mapPointToStopRegistryGeoJSON } from '../../utils';

export interface InsertStopPlaceInput {
  readonly label: string;
  readonly coordinates: Position;
  readonly validityStart: DateTime | null | undefined;
  readonly validityEnd: DateTime | null | undefined;
  readonly priority: Priority;
}

const GQL_INSERT_STOP_PLACE = gql`
  mutation InsertStopPlace($object: stop_registry_StopPlaceInput) {
    stop_registry {
      mutateStopPlace(StopPlace: $object) {
        publicCode
        id
        quays {
          id
          publicCode
        }
        keyValues {
          key
          values
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
    validityStart,
    validityEnd,
    priority,
  }: InsertStopPlaceInput): {
    variables: InsertStopPlaceMutationVariables;
  } => ({
    variables: {
      object: {
        // TODO: change the name to the actual name after we add the inputs for it.
        // For now we use label as placeholder so that we can create the tiamat instance of the stop
        name: { lang: 'fin', value: label },
        quays: [{ publicCode: label }],
        geometry: mapPointToStopRegistryGeoJSON({
          longitude: coordinates[0],
          latitude: coordinates[1],
        }),
        keyValues: [
          {
            key: 'validityStart',
            values: validityStart ? [validityStart.toISODate()] : [],
          },
          {
            key: 'validityEnd',
            values: validityEnd ? [validityEnd.toISODate()] : [],
          },
          { key: 'priority', values: [priority.toString(10)] },
        ],
      },
    },
  });

  return {
    mapToInsertStopPlaceVariables,
    insertStopPlaceMutation,
  };
};
