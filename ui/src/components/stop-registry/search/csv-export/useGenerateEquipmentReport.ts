import { gql, useApolloClient } from '@apollo/client';
import compact from 'lodash/compact';
import noop from 'lodash/noop';
import uniq from 'lodash/uniq';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetStopPlaceAndRelatedQuaysDocument,
  GetStopPlaceAndRelatedQuaysQuery,
  GetStopPlaceAndRelatedQuaysQueryVariables,
  ResolveSearchResultNetexIdsDocument,
  ResolveSearchResultNetexIdsQuery,
  ResolveSearchResultNetexIdsQueryVariables,
  StopPlaceDetailsFragment,
} from '../../../../generated/graphql';
import { EnrichedStopPlace, StopPlace } from '../../../../types';
import {
  AsyncTaskCancelledError,
  getStopPlacesFromQueryResult,
} from '../../../../utils';
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
  ReportContext,
} from './types';

const GQL_RESOLVE_SEARCH_RESULT_NETEX_IDS = gql`
  query ResolveSearchResultNetexIds(
    $where: stops_database_quay_newest_version_bool_exp!
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
  query GetStopPlaceAndRelatedQuays($stopPlaceNetexId: String!) {
    stopRegistry: stop_registry {
      stopPlace(id: $stopPlaceNetexId, onlyMonomodalStopPlaces: true) {
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

/**
 * Parse raw results from the "Resolve all Netex IDs" -query.
 *
 * @param data Raw result data from the query
 */
function parseIdPairs(
  data: ResolveSearchResultNetexIdsQuery | undefined,
): ReadonlyArray<QuayAndStopPlaceIds> {
  return (
    mapCompactOrNull(data?.stopsDb?.search, (raw) => {
      if (raw.quayNetexId && raw.stopPlaceNetexId) {
        return {
          quayNetexId: raw.quayNetexId,
          stopPlaceNetexId: raw.stopPlaceNetexId,
        };
      }

      return null;
    }) ?? []
  );
}

/**
 * Resolve filters or preknown list of ids into proper Quay+StopPlace NetexID
 * pairs that can be used to fetch the proper details from Tiamat.
 */
function useResolveQuayAndStopPlaceIds(): ResolveQuayAndStopPlaceIdsFn {
  const apollo = useApolloClient();

  return useCallback(
    async (options) => {
      if ('alreadyKnownIds' in options) {
        return options.alreadyKnownIds;
      }

      const where = filtersAndResultSelectionToQueryVariables(
        options.filters,
        options.selection,
      );

      const results = await apollo.query<
        ResolveSearchResultNetexIdsQuery,
        ResolveSearchResultNetexIdsQueryVariables
      >({
        query: ResolveSearchResultNetexIdsDocument,
        fetchPolicy: 'network-only',
        variables: { where },

        // At this moment, Apollo does not handle AbortSignals gracefully.
        // Apollo itself does not have direct support for them, but the HTTP
        // link can pass through the signal to the underlying fetch call.
        // But Apollo also dedupes queries, so if we have 2 reports requesting
        // the same data through a different query, but with same variables,
        // both of those calls get aborted, even tough only one of them is
        // supposed to be. This developer tried to also circumvent this
        // deduping behaviour by including an extra UUID v4 variable in the
        // query, that would have marked each instance unique, but Apollo
        // discards any and all variables, not actually used within the query,
        // even if they are declared as nonnull: query A($uniq: String!)
        // Comment link tag: Apollo and Abort Signals.
        // context: { fetchOptions: { signal: abortSignal } },
      });

      // Apollo does not handle the cancellation gracefully and can return
      // garbled up result on absort signal.
      options.abortSignal.throwIfAborted();

      return parseIdPairs(results.data);
    },
    [apollo],
  );
}

function groupQuayIdsByStopPlace(
  allIds: ReadonlyArray<QuayAndStopPlaceIds>,
): Readonly<Record<string, ReadonlyArray<string>>> {
  return allIds.reduce(
    (r, idPair) => {
      // eslint-disable-next-line no-param-reassign
      r[idPair.stopPlaceNetexId] ??= [];
      r[idPair.stopPlaceNetexId].push(idPair.quayNetexId);
      return r;
    },
    {} as Record<string, Array<string>>,
  );
}

function idPairsToHelperContainers(allIds: ReadonlyArray<QuayAndStopPlaceIds>) {
  // List of StopPlaces we need to fetch
  const uniqueStopPlaces = uniq(allIds.map((pair) => pair.stopPlaceNetexId));

  // Lists of Quays we expect to be returned by the Tiamat StopPlace fetch queries.
  const expectedQuayIdsByStopPlaceId = groupQuayIdsByStopPlace(allIds);

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

  return {
    uniqueStopPlaces,
    expectedQuayIdsByStopPlaceId,
    promisedStopPlaces,
    promisedQuays,
  };
}

type HelperContainers = ReturnType<typeof idPairsToHelperContainers>;

/**
 * Helper functions to register fetched and parsed data result into the Promise maps.
 * @param helperContainers
 */
function getDataResolvers(helperContainers: HelperContainers) {
  const markQuayAsResolved = (quay: EnrichedQuayWithTimingPlace) => {
    helperContainers.promisedQuays.get(quay.id ?? '')?.resolve(quay);
  };

  const markStopPlaceAsResolved = (stopPlace: EnrichedStopPlace) => {
    helperContainers.promisedStopPlaces
      .get(stopPlace.id ?? '')
      ?.resolve(stopPlace);
  };

  const markQuaysAsRejected = (stopPlaceNetexId: string, reason: unknown) => {
    helperContainers.expectedQuayIdsByStopPlaceId[stopPlaceNetexId]?.forEach(
      (quayId) => helperContainers.promisedQuays.get(quayId)?.reject(reason),
    );
  };

  const markStopPlaceAsRejected = (
    stopPlaceNetexId: string,
    reason: unknown,
  ) => {
    helperContainers.promisedStopPlaces.get(stopPlaceNetexId)?.reject(reason);
    markQuaysAsRejected(stopPlaceNetexId, reason);
  };

  return {
    markQuayAsResolved,
    markStopPlaceAsResolved,
    markQuaysAsRejected,
    markStopPlaceAsRejected,
  };
}

type DataResolvers = ReturnType<typeof getDataResolvers>;

/**
 * Unpure side-effect-full function to parse the raw StopPlace fetched from
 * Tiamat, into the enriched UI form and then register it as fetched,
 * or alternatively marked as rejected in case of errors.
 *
 * @param resolvers Resolvers and rejectors for registering the result.
 * @param stopPlaceNetexId Id of the Stop Place we are processing.
 * @param data TThe raw StopPlace response data from Tiamat
 */
function processRawStopPlace(
  resolvers: DataResolvers,
  stopPlaceNetexId: string,
  data: GetStopPlaceAndRelatedQuaysQuery | undefined,
) {
  // Process and register the StopPlace details
  const rawStopPlace = getStopPlacesFromQueryResult<StopPlace>(
    data?.stopRegistry?.stopPlace,
  ).at(0);

  const enrichedStopPlace = getEnrichedStopPlace(rawStopPlace);
  if (!rawStopPlace || !enrichedStopPlace) {
    const reason = new Error(
      `Unable to get Enriched Stop Place from response! Response: ${JSON.stringify(data)}`,
    );
    resolvers.markStopPlaceAsRejected(stopPlaceNetexId, reason);
    throw reason;
  }

  resolvers.markStopPlaceAsResolved(enrichedStopPlace);

  return { rawStopPlace, enrichedStopPlace };
}

/**
 * Extract and parse the raw Quays from the Tiamat response in to the Enriched
 * UI format.
 *
 * @param rawStopPlace Raw StopPlace data to extract the quays from.
 */
function parseQuays(
  rawStopPlace: StopPlaceDetailsFragment,
): ReadonlyArray<EnrichedQuayWithTimingPlace> {
  return compact(
    rawStopPlace.quays?.map<EnrichedQuayWithTimingPlace | null>((rawQuay) => {
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
    }),
  );
}

/**
 * Unpure side-effect-full function to parse the raw Quays from the raw StopPlace
 * response from tiamat, and to then register them as fetched, or rejected.
 *
 * Returns the number of processed quays, that had explicitly requested. Tiamat
 * response can contain other unrelated quays too.
 *
 * @param helperContainers
 * @param resolvers Resolvers and rejectors for registering the result.
 * @param rawStopPlace The raw StopPlace response data from Tiamat.
 */
function processQuays(
  helperContainers: HelperContainers,
  resolvers: DataResolvers,
  rawStopPlace: StopPlaceDetailsFragment,
): number {
  const quays = parseQuays(rawStopPlace);

  const expectedQuays =
    helperContainers.expectedQuayIdsByStopPlaceId[rawStopPlace.id ?? ''] ?? [];
  const allQuaysFound = expectedQuays.every((id) =>
    quays.some((quay) => quay.id === id),
  );

  if (!allQuaysFound) {
    const reason = new Error('Some quays were not found!');
    resolvers.markQuaysAsRejected(rawStopPlace.id ?? '', reason);
  }

  quays.forEach(resolvers.markQuayAsResolved);

  return expectedQuays.length;
}

/**
 * Setup iterators for processing the data.
 *
 * @param uniqueStopPlaces Unique list of StopPlace ID's that need to be fetched from Tiamat.
 * @param concurrentFetches How many Tiamat queries to fire simultaneously.
 */
function getFetchIterators(
  { uniqueStopPlaces }: HelperContainers,
  concurrentFetches: number,
) {
  const initialFetchesIterator = uniqueStopPlaces
    .values()
    .take(concurrentFetches);

  const pendingFetchesIterator = uniqueStopPlaces
    .values()
    .drop(concurrentFetches);

  return { initialFetchesIterator, pendingFetchesIterator };
}

/**
 * Fire the initial concurrentFetches Tiamat queries, and chain the rest to be
 * performed as previous queries are processed.
 *
 * @param helperContainers
 * @param concurrentFetches
 * @param abortSignal
 * @param fetchStopPlace The data fetched function implementation.
 */
function initiateFetchChains(
  helperContainers: HelperContainers,
  concurrentFetches: number,
  abortSignal: AbortSignal,
  fetchStopPlace: (stopPlaceNetexId: string) => Promise<void>,
) {
  // List of errors that have happened
  const errors: Array<unknown> = [];

  const { initialFetchesIterator, pendingFetchesIterator } = getFetchIterators(
    helperContainers,
    concurrentFetches,
  );

  // Start a for a single StopPlace and once it is in recurse and fetch the
  // next pending one.
  const fetchAndQueueNextStopPlace = async (
    stopPlaceNetexId: string,
  ): Promise<void> => {
    await fetchStopPlace(stopPlaceNetexId);

    let next: IteratorResult<string, unknown> = pendingFetchesIterator.next();
    while (!next.done && !errors.length && !abortSignal.aborted) {
      // eslint-disable-next-line no-await-in-loop
      await fetchStopPlace(next.value);
      next = pendingFetchesIterator.next();
    }
  };

  // Tigger the initial (concurrentFetches) StopPlace fetches.
  const fetchChains = initialFetchesIterator.map((id) =>
    fetchAndQueueNextStopPlace(id).catch((e) => {
      errors.push(e);
      throw e;
    }),
  );

  return Promise.all(fetchChains)
    .then(() => true)
    .catch((reason) => {
      throw new AggregateError(
        errors.length ? errors : [reason],
        'Failed to fetch and/or process one or more StopPlaces!',
      );
    });
}

/**
 * Translate the created helper bits into the actual getEnrichedStopDetails
 * function implementation needed for {@link TiamatStopDataFetcher}.
 *
 * @param helperContainers
 * @param allLoaded
 * @param waitForAllToLoad
 */
function makeGetEnrichedStopDetails(
  helperContainers: HelperContainers,
  allLoaded: Promise<boolean>,
  waitForAllToLoad: boolean,
): (idPair: QuayAndStopPlaceIds) => Promise<EnrichedStopDetails> {
  return async (idPair: QuayAndStopPlaceIds): Promise<EnrichedStopDetails> => {
    if (waitForAllToLoad) {
      await allLoaded;
    }

    // Control flow wise these should never hang indefinitely
    const stopPlace = await helperContainers.promisedStopPlaces.get(
      idPair.stopPlaceNetexId,
    )?.promise;
    const quay = await helperContainers.promisedQuays.get(idPair.quayNetexId)
      ?.promise;

    if (!stopPlace || !quay) {
      throw new Error('Not found!!!');
    }

    return { stopPlace, quay };
  };
}

function useTiamatStopDataFetcher(
  concurrentFetches: number = 20,
  waitForAllToLoad: boolean = true,
): InitTiamatStopDataFetcherFn {
  const apollo = useApolloClient();

  return useCallback(
    (allIds, abortSignal, onProgress) => {
      let quaysLoaded = 0;

      const helperContainers = idPairsToHelperContainers(allIds);
      const resolvers = getDataResolvers(helperContainers);

      // Query Tiamat for a StopPlace and register the result onto the premade
      // data promises (promisedStopPlaces & promisedQuays)
      const fetchStopPlace = async (stopPlaceNetexId: string) => {
        // Query Tiamat for data
        const result = await apollo.query<
          GetStopPlaceAndRelatedQuaysQuery,
          GetStopPlaceAndRelatedQuaysQueryVariables
        >({
          query: GetStopPlaceAndRelatedQuaysDocument,
          fetchPolicy: 'network-only',
          variables: { stopPlaceNetexId },

          // See comment earlier in the file. Search: Apollo and Abort Signals
          // context: { fetchOptions: { signal: abortSignal } },
        });

        // Apollo does not handle the cancellation gracefully and can return
        // garbled up result object on abort signal.
        abortSignal.throwIfAborted();

        const { rawStopPlace } = processRawStopPlace(
          resolvers,
          stopPlaceNetexId,
          result.data,
        );

        // Process and register each individual Quay of the StopPlace
        quaysLoaded += processQuays(helperContainers, resolvers, rawStopPlace);
        onProgress(quaysLoaded);
      };

      // Helper iterators for StopPlace fetches.
      const allLoaded = initiateFetchChains(
        helperContainers,
        concurrentFetches,
        abortSignal,
        fetchStopPlace,
      );

      // Make sure there is always some sort of handler for the allLoaded promise.
      // Silences a nag about unhandled promise in the browser console.
      allLoaded.catch(noop);

      const getEnrichedStopDetails = makeGetEnrichedStopDetails(
        helperContainers,
        allLoaded,
        waitForAllToLoad,
      );

      return { allLoaded, getEnrichedStopDetails };
    },
    [concurrentFetches, waitForAllToLoad, apollo],
  );
}

function usePrepareDataForExport() {
  const resolveQuayAndStopPlaceIds = useResolveQuayAndStopPlaceIds();
  const tiamatStopDataFetcher = useTiamatStopDataFetcher(10);

  return async (
    filters: StopSearchFilters,
    selection: ResultSelection,
    abortSignal: AbortSignal,
    onAllStopsResolved: (count: number) => void,
    onQuaysLoadedProgress: OnQuaysProcessedProgress,
  ) => {
    const ids = await resolveQuayAndStopPlaceIds({
      filters,
      selection,
      abortSignal,
    });
    onAllStopsResolved(ids.length);

    // Begins asynchronously fetching data on the background
    const dataFetcher = tiamatStopDataFetcher(
      ids,
      abortSignal,
      onQuaysLoadedProgress,
    );

    await dataFetcher.allLoaded;

    // Wait for all id pairs to get downloaded and parsed.
    return Promise.all(ids.map(dataFetcher.getEnrichedStopDetails));
  };
}

type FetchWriteProgressControls = {
  readonly onTotalCountResolved: (stopCount: number) => void;
  readonly onDataFetched: (fetchedCount: number) => void;
  readonly onDataWritten: (writtenCount: number) => void;
};

function makeFetchWriteProgressControls(
  onProgress: OnProgress,
): FetchWriteProgressControls {
  // Downloading data takes longer than writing it to the CSV report.
  const dataFetchProgressWeight = 0.8;
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
        progress: (loaded / stopCount) * dataFetchProgressWeight,
      });
    }

    return onProgress({
      indeterminate: false,
      progress:
        dataFetchProgressWeight +
        (written / stopCount) * (1 - dataFetchProgressWeight),
    });
  };

  return {
    onTotalCountResolved: (resolvedCount) => {
      stopCount = resolvedCount;
      onUpdateProgress();
    },
    onDataFetched: (loadedCountUpdate) => {
      loaded = loadedCountUpdate;
      onUpdateProgress();
    },
    onDataWritten: (writtenCountUpdate) => {
      written = writtenCountUpdate;
      onUpdateProgress();
    },
  };
}

export function useGenerateEquipmentReport() {
  const { t } = useTranslation();
  const prepareDataForExport = usePrepareDataForExport();

  return async (
    filters: StopSearchFilters,
    selection: ResultSelection,
    filename: string,
    saveFileNamePrompt: string,
    abortSignal: AbortSignal,
    onProgress: OnProgress,
  ): Promise<string> => {
    const { onTotalCountResolved, onDataFetched, onDataWritten } =
      makeFetchWriteProgressControls(onProgress);

    const data = await prepareDataForExport(
      filters,
      selection,
      abortSignal,
      onTotalCountResolved,
      onDataFetched,
    );

    const context: ReportContext = { observationDate: filters.observationDate };
    using report = new EquipmentReport(t, data, context);
    const download = await report.generate(abortSignal, onDataWritten);

    abortSignal.throwIfAborted();

    // eslint-disable-next-line no-alert
    const userGivenFilename = window.prompt(saveFileNamePrompt, filename);

    if (userGivenFilename === null) {
      throw new AsyncTaskCancelledError(
        'Report generated, but user canceled download.',
      );
    }

    const actualFileName = userGivenFilename.trim()
      ? userGivenFilename
      : filename;
    download(actualFileName);
    return actualFileName;
  };
}
