import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetStopPlaceAndRelatedQuaysLazyQuery,
  useResolveSearchResultNetextIdsLazyQuery,
} from '../../../../generated/graphql';
import { EnrichedStopPlace, StopPlace } from '../../../../types';
import { getStopPlacesFromQueryResult } from '../../../../utils';
import { getEnrichedStopPlace } from '../../stop-areas/stop-area-details/useGetStopAreaDetails';
import { mapCompactOrNull, mapToEnrichedQuay } from '../../utils';
import { filtersAndResultSelectionToQueryVariables } from '../by-stop/filtersToQueryVariables';
import { ResultSelection, StopSearchFilters } from '../types';
import { EquipmentReport } from './EquipmentReport';
import {
  ByAlreadyKnownIds,
  ByFiltersAndSelection,
  EnrichedQuayWithTimingPlace,
  EnrichedStopDetails,
  InitTiamatStopDataFetcherFn,
  OnProgress,
  OnQuaysProcessedProgress,
  QuayAndStopPlaceIds,
} from './types';

const GQL_RESOLVE_SEARCH_RESULT_NETEX_IDS = gql`
  query ResolveSearchResultNetextIds(
    $where: stops_database_quay_newest_version_bool_exp
  ) {
    stopsDb: stops_database {
      search: stops_database_quay_newest_version(
        where: $where
        order_by: [{ id: asc }]
      ) {
        quayNetexId: netex_id
        stopPlaceNetexId: stop_place_netex_id
      }
    }
  }
`;

const GQL_GET_STOP_PLACE_AND_RELATED_QUAYS = gql`
  query GetStopPlaceAndRelatedQuays($stopPlaceNetextId: String!) {
    stopRegistry: stop_registry {
      stopPlace(id: $stopPlaceNetextId, onlyMonomodalStopPlaces: true) {
        ...stop_place_details

        ... on stop_registry_StopPlace {
          quays {
            scheduled_stop_point {
              timing_place {
                label
              }
            }
          }
        }
      }
    }
  }
`;

type ResolveQuayAndStopPlaceIdsFn = (
  options: ByAlreadyKnownIds | ByFiltersAndSelection,
) => Promise<ReadonlyArray<QuayAndStopPlaceIds>>;

function useResolveQuayAndStopPlaceIds(): ResolveQuayAndStopPlaceIdsFn {
  const [resolveSearchResultNetextIds] =
    useResolveSearchResultNetextIdsLazyQuery();

  return useCallback(
    async (options) => {
      if ('alreadyKnownIds' in options) {
        return options.alreadyKnownIds;
      }

      const where = filtersAndResultSelectionToQueryVariables(
        options.filters,
        options.selection,
      );

      const results = await resolveSearchResultNetextIds({
        variables: { where },
      });

      return (
        mapCompactOrNull(results.data?.stopsDb?.search, (raw) => {
          if (raw.quayNetexId && raw.stopPlaceNetexId) {
            return {
              quayNetexId: raw.quayNetexId,
              stopPlaceNetexId: raw.stopPlaceNetexId,
            };
          }

          return null;
        }) ?? []
      );
    },
    [resolveSearchResultNetextIds],
  );
}

function useTiamatStopDataFetcher(
  concurrentFetches: number = 20,
  waitForAllToLoad: boolean = true,
): InitTiamatStopDataFetcherFn {
  const [getStopPlaceAndRelatedQuays] = useGetStopPlaceAndRelatedQuaysLazyQuery(
    { fetchPolicy: 'network-only' },
  );

  return (allIds, onProgress) => {
    let quaysLoaded = 0;

    // List of StopPlaces we need to fetch
    const uniqueStopPlaces = uniq(allIds.map((pair) => pair.stopPlaceNetexId));

    // Lists of Quays we expect to be returned by the Tiamat StopPlace fetch queries.
    const expectedQuayIdsByStopPlaceId: Readonly<
      Record<string, ReadonlyArray<string>>
    > = allIds.reduce(
      (r, idPair) => {
        // eslint-disable-next-line no-param-reassign
        r[idPair.stopPlaceNetexId] ??= [];
        r[idPair.stopPlaceNetexId].push(idPair.quayNetexId);
        return r;
      },
      {} as Record<string, Array<string>>,
    );

    // Premade promises if StopPlaces that are to fetched
    const promisedStopPlaces = new Map(
      uniqueStopPlaces.map((stopPlaceNetexId) => [
        stopPlaceNetexId,
        Promise.withResolvers<EnrichedStopPlace>(),
      ]),
    );

    // Premade promises if Quays that are to fetched with the StopPlaces
    const promisedQuays = new Map(
      allIds.map((pair) => [
        pair.quayNetexId,
        Promise.withResolvers<EnrichedQuayWithTimingPlace>(),
      ]),
    );

    const markQuaysAsRejected = (stopPlaceNetexId: string, reason: unknown) => {
      expectedQuayIdsByStopPlaceId[stopPlaceNetexId]?.forEach((quayId) =>
        promisedQuays.get(quayId)?.reject(reason),
      );
    };

    const markStopPlaceAsRejected = (
      stopPlaceNetexId: string,
      reason: unknown,
    ) => {
      promisedStopPlaces.get(stopPlaceNetexId)?.reject(reason);
      markQuaysAsRejected(stopPlaceNetexId, reason);
    };

    // Query Tiamat for a StopPlace and register the result onto the premade
    // data promises (promisedStopPlaces & promisedQuays)
    const fetchStopPlace = async (stopPlaceNetextId: string) => {
      // Query Tiamat for data
      const result = await getStopPlaceAndRelatedQuays({
        variables: { stopPlaceNetextId },
      });

      // Process and register the StopPlace details
      const rawStopPlace = getStopPlacesFromQueryResult<StopPlace>(
        result.data?.stopRegistry?.stopPlace,
      ).at(0);

      const enrichedStopPlace = getEnrichedStopPlace(rawStopPlace);
      if (!rawStopPlace || !enrichedStopPlace) {
        const reason = new Error(
          `Unable to get Enriched Stop Place from response! Response: ${JSON.stringify(result.data)}`,
        );
        markStopPlaceAsRejected(stopPlaceNetextId, reason);
        throw reason;
      }

      promisedStopPlaces.get(stopPlaceNetextId)?.resolve(enrichedStopPlace);

      // Process and register each individual Quay of the StopPlace
      const quays = compact(
        rawStopPlace.quays?.map<EnrichedQuayWithTimingPlace | null>(
          (rawQuay) => {
            const enriched = mapToEnrichedQuay(
              rawQuay,
              rawStopPlace.accessibilityAssessment,
            );
            return enriched
              ? {
                  ...enriched,
                  timingPlace:
                    rawQuay?.scheduled_stop_point?.timing_place?.label ?? null,
                }
              : null;
          },
        ),
      );

      const expectedQuays =
        expectedQuayIdsByStopPlaceId[stopPlaceNetextId] ?? [];
      const allQuaysFound = expectedQuays.every((id) =>
        quays.some((quay) => quay.id === id),
      );

      if (!allQuaysFound) {
        const reason = new Error('Some quays were not found!');
        markQuaysAsRejected(stopPlaceNetextId, reason);
      }

      quays.forEach((enrichedQuay) =>
        promisedQuays.get(enrichedQuay.id ?? '')?.resolve(enrichedQuay),
      );
      quaysLoaded += expectedQuays.length;
      onProgress(quaysLoaded);
    };

    // Helper iterators for StopPlace fetches.
    const initialFetchesIterator = uniqueStopPlaces
      .values()
      .take(concurrentFetches);
    const pendingFetchesIterator = uniqueStopPlaces
      .values()
      .drop(concurrentFetches);

    // List of errors that have happened
    const errors: Array<unknown> = [];

    // Start a for a single StopPlace and once it is in recurse and fetch the
    // next pending one.
    const fetchAndQueueNextStopPlace = (
      stopPlaceNetextId: string,
    ): Promise<void> =>
      fetchStopPlace(stopPlaceNetextId).then(() => {
        const { done, value } = pendingFetchesIterator.next();

        // If more StopPlaces need fetching and no error has happened.
        if (!done && !errors.length) {
          return fetchAndQueueNextStopPlace(value);
        }

        return Promise.resolve();
      });

    // Tigger the initial (concurrentFetches) StopPlace fetches.
    const fetchChains = initialFetchesIterator.map((id) =>
      fetchAndQueueNextStopPlace(id).catch((e) => errors.push(e)),
    );
    const allLoaded = Promise.all(fetchChains)
      .then(() => true)
      .catch((reason) => {
        throw new AggregateError(
          errors.length ? errors : [reason],
          'Failed to fetch and/or process one or more StopPlaces!',
        );
      });

    const getEnrichedStopDetails = async (
      idPair: QuayAndStopPlaceIds,
    ): Promise<EnrichedStopDetails> => {
      if (waitForAllToLoad) {
        await allLoaded;
      }

      // Control flow wise these should never hang indefinitely
      const stopPlace = await promisedStopPlaces.get(idPair.stopPlaceNetexId)
        ?.promise;
      const quay = await promisedQuays.get(idPair.quayNetexId)?.promise;

      if (!stopPlace || !quay) {
        throw new Error('Not found!!!');
      }

      return { stopPlace, quay };
    };

    return { allLoaded, getEnrichedStopDetails };
  };
}

function usePrepareDataForExport() {
  const resolveQuayAndStopPlaceIds = useResolveQuayAndStopPlaceIds();
  const tiamatStopDataFetcher = useTiamatStopDataFetcher(10);

  return async (
    filters: StopSearchFilters,
    selection: ResultSelection,
    onAllStopsResolved: (count: number) => void,
    onQuaysLoadedProgress: OnQuaysProcessedProgress,
  ) => {
    const ids = await resolveQuayAndStopPlaceIds({ filters, selection });
    onAllStopsResolved(ids.length);

    // Begins asynchronously fetching data on the background
    const dataFetcher = tiamatStopDataFetcher(ids, onQuaysLoadedProgress);

    await dataFetcher.allLoaded;

    // Wait for all id pairs to get downloaded and parsed.
    return Promise.all(ids.map(dataFetcher.getEnrichedStopDetails));
  };
}

export function useGenerateEquipmentReport() {
  const { t } = useTranslation();
  const prepareDataForExport = usePrepareDataForExport();

  return async (
    filters: StopSearchFilters,
    selection: ResultSelection,
    filename: string,
    onProgress: OnProgress,
  ) => {
    let stopCount: number | null = null;
    let loaded: number = 0;
    let written: number = 0;

    const onUpdateProgress = () => {
      if (stopCount === null) {
        return onProgress({ indeterminate: true });
      }

      if (loaded === stopCount && written === stopCount) {
        return onProgress({ indeterminate: false, progress: 1 });
      }

      if (loaded < stopCount) {
        return onProgress({
          indeterminate: false,
          progress: (loaded / stopCount) * 0.7,
        });
      }

      return onProgress({
        indeterminate: false,
        progress: 0.7 + (written / stopCount) * 0.3,
      });
    };

    const data = await prepareDataForExport(
      filters,
      selection,
      (resolvedCount) => {
        stopCount = resolvedCount;
        onUpdateProgress();
      },
      (loadedCountUpdate) => {
        loaded = loadedCountUpdate;
        onUpdateProgress();
      },
    );
    using report = new EquipmentReport(t, data);

    return report
      .generate((writtenCountUpdate) => {
        written = writtenCountUpdate;
        onUpdateProgress();
      })
      .then((download) => download(filename));
  };
}
