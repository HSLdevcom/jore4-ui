import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  ResolveStopSheltersQuery,
  StopRegistryShelterEquipment,
  useResolveStopSheltersLazyQuery,
} from '../../../../../../generated/graphql';
import { FailedToResolveNewShelters } from '../errors';

const GQL_RESOLVE_STOP_SHELTERS = gql`
  query ResolveStopShelters($netexId: String!) {
    stop_registry {
      stopPlace(query: $netexId, onlyMonomodalStopPlaces: true) {
        id
        version

        ... on stop_registry_StopPlace {
          quays {
            id
            version

            placeEquipments {
              id
              shelterEquipment {
                ...shelter_equipment_details
              }
            }
          }
        }
      }
    }
  }
`;

function getSheltersFromResult(
  data: ResolveStopSheltersQuery | undefined,
  netexId: string,
): Array<StopRegistryShelterEquipment> {
  const stopPlace = data?.stop_registry?.stopPlace?.at(0);

  if (stopPlace && 'quays' in stopPlace) {
    const matchingQuay = stopPlace.quays?.find((quay) => quay?.id === netexId);
    const rawShelterList = matchingQuay?.placeEquipments?.shelterEquipment;

    if (rawShelterList) {
      return compact(rawShelterList);
    }
  }

  return [];
}

export function useGetShelters() {
  const [resolveStopShelters] = useResolveStopSheltersLazyQuery();

  return useCallback(
    async (netexId: string) => {
      try {
        const result = await resolveStopShelters({ variables: { netexId } });
        return getSheltersFromResult(result.data, netexId);
      } catch (cause) {
        throw new FailedToResolveNewShelters(
          "Failed to resolve new stop's shelters!",
          { cause },
        );
      }
    },
    [resolveStopShelters],
  );
}
