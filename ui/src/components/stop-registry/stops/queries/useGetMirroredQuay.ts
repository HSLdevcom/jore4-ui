import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  GetStopDetailsQuery,
  useGetStopDetailsLazyQuery,
} from '../../../../generated/graphql';
import { EnrichedQuay, Quay, StopPlace } from '../../../../types';
import { getStopPlacesFromQueryResult } from '../../../../utils';
import { mapToEnrichedQuay } from '../../utils';

// TODO: Currently reuses the full GetStopDetails query which fetches all fields.
// Once the mirrored data requirements are finalized, create a dedicated
// GetMirroredQuayDetails query with a lighter fragment to avoid overfetching.

function findQuayByNetexId(
  data: GetStopDetailsQuery | undefined,
  quayNetexId: string,
): { quay: Quay; stopPlace: StopPlace } | null {
  const stopPlaceResults = data?.stopsDb?.newestVersion ?? [];

  for (const result of stopPlaceResults) {
    const [stopPlace] = getStopPlacesFromQueryResult<StopPlace>(
      result.TiamatStopPlace,
    );
    if (stopPlace) {
      const quay = compact(stopPlace.quays).find((q) => q.id === quayNetexId);
      if (quay) {
        return { quay, stopPlace };
      }
    }
  }

  return null;
}

export function useGetMirroredQuay() {
  const [getStopDetailsLazy] = useGetStopDetailsLazyQuery();

  return useCallback(
    async (quayNetexId: string): Promise<EnrichedQuay | null> => {
      const { data } = await getStopDetailsLazy({
        variables: {
          where: {
            stop_place_quays: {
              quay: {
                netex_id: { _eq: quayNetexId },
              },
            },
          },
        },
      });

      const result = findQuayByNetexId(data, quayNetexId);
      if (!result) {
        return null;
      }

      return mapToEnrichedQuay(
        result.quay,
        result.stopPlace.accessibilityAssessment,
      );
    },
    [getStopDetailsLazy],
  );
}
