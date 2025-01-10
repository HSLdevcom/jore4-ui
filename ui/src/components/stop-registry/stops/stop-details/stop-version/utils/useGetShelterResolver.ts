import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  ResolveStopSheltersQuery,
  StopRegistryShelterEquipment,
  useResolveStopSheltersLazyQuery,
} from '../../../../../../generated/graphql';
import { FailedToResolveNewShelters } from '../errors';
import { hasDuplicateShelters } from './hasDuplicateShelters';

const GQL_RESOLVE_STOP_SHELTERS = gql`
  query ResolveStopShelters($netexId: String!) {
    stop_registry {
      stopPlace(id: $netexId) {
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

function compareShelters(
  original: StopRegistryShelterEquipment,
  saved: StopRegistryShelterEquipment,
): boolean {
  const originalRecord = original as Readonly<Record<string, unknown>>;
  const savedRecord = saved as Readonly<Record<string, unknown>>;

  return Object.entries(originalRecord).every(([key, originalValue]) => {
    // Skip ID
    if (key === 'id') {
      return true;
    }

    const savedValue = savedRecord[key];
    // Treat undefined as === to null
    return (originalValue ?? null) === (savedValue ?? null);
  });
}

class ShelterResolver {
  public shelters: ReadonlyArray<StopRegistryShelterEquipment>;

  constructor(shelters: ReadonlyArray<StopRegistryShelterEquipment>) {
    this.shelters = shelters;
  }

  getIdForShelter(
    originalShelter: StopRegistryShelterEquipment,
  ): string | null {
    return (
      this.shelters.find((saved) => compareShelters(originalShelter, saved))
        ?.id ?? null
    );
  }

  getIdForIndex(index: number): string | null {
    return this.shelters.at(index)?.id ?? null;
  }

  shouldResolveByIndex() {
    return hasDuplicateShelters(this.shelters);
  }
}

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

export function useGetShelterResolver() {
  const [resolveStopShelters] = useResolveStopSheltersLazyQuery();

  return useCallback(
    async (netexId: string) => {
      try {
        const result = await resolveStopShelters({ variables: { netexId } });
        const shelters = getSheltersFromResult(result.data);

        return new ShelterResolver(shelters);
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
