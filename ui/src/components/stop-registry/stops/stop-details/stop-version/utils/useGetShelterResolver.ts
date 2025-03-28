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
      stopPlace(query: $netexId) {
        id

        ... on stop_registry_StopPlace {
          quays {
            id

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
): Array<StopRegistryShelterEquipment> {
  const stopPlace = data?.stop_registry?.stopPlace?.at(0);

  if (stopPlace && 'quays' in stopPlace) {
    const rawShelterList =
      stopPlace.quays?.at(0)?.placeEquipments?.shelterEquipment;

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
        return getSheltersFromResult(result.data);
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
