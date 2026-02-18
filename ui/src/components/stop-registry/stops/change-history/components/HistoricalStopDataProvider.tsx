import compact from 'lodash/compact';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DetailsForHistoricalStopVersionFragment,
  StopRegistryStopPlaceInterface,
} from '../../../../../generated/graphql';
import { EnrichedQuay, EnrichedStopPlace } from '../../../../../types';
import {
  areEqual,
  getStopPlaceDetailsForEnrichment,
  none,
} from '../../../../../utils';
import { mapToEnrichedQuay } from '../../../utils';
import { HistoricalStopDataCacheInconsistencyError } from '../errors';
import { useGetHistoricalStopPlace } from '../queries';
import {
  HistoricalStopData,
  HistoricalStopVersionSpecifier,
  QuayVersionSpecifier,
  StopPlaceVersionSpecifier,
} from '../types';

type AsyncCacheDataRequested<KeyT> = {
  readonly key: KeyT;
  readonly status: 'requested';
  readonly value: null;
  readonly error?: never;
};

type AsyncCacheDataFetching<KeyT> = {
  readonly key: KeyT;
  readonly status: 'fetching';
  readonly value: null;
  readonly error?: never;
};

type AsyncCacheDataFetched<KeyT, ValueT> = {
  readonly key: KeyT;
  readonly status: 'fetched';
  readonly value: ValueT;
  readonly error?: never;
};

type AsyncCacheDataError<KeyT> = {
  readonly key: KeyT;
  readonly status: 'error';
  readonly value: null;
  readonly error: unknown;
};

type AsyncCacheData<KeyT, ValueT> =
  | AsyncCacheDataRequested<KeyT>
  | AsyncCacheDataFetching<KeyT>
  | AsyncCacheDataFetched<KeyT, ValueT>
  | AsyncCacheDataError<KeyT>;

type StopPlaceCacheEntry = AsyncCacheData<
  StopPlaceVersionSpecifier,
  EnrichedStopPlace
>;

type StopPlaceCache = ReadonlyArray<StopPlaceCacheEntry>;

type QuayCacheEntry = {
  readonly key: QuayVersionSpecifier;
  readonly value: EnrichedQuay;
};

type QuayCache = ReadonlyArray<QuayCacheEntry>;

type EnrichedCache = {
  readonly stopPlaces: StopPlaceCache;
  readonly quays: QuayCache;
};

type HistoricalStopDataProviderContext = {
  readonly cache: EnrichedCache;
  readonly request: (version: StopPlaceVersionSpecifier) => void;
  readonly refetchFailed: () => void;
};

const HistoricalStopDataProviderContext =
  createContext<HistoricalStopDataProviderContext>({
    cache: {
      stopPlaces: [],
      quays: [],
    },
    request: noop,
    refetchFailed: noop,
  });

function hasSameKey<KeyT>(
  match: KeyT,
): (entity: { readonly key: KeyT }) => boolean {
  return (entity) => areEqual(match, entity.key);
}

/**
 * Pick the StopPlace key fields from the version.
 * @param version
 */
function cleanStopPlaceKey(
  version: StopPlaceVersionSpecifier,
): StopPlaceVersionSpecifier {
  return pick(version, 'stopPlaceNetexId', 'stopPlaceVersion');
}

/**
 * Pick the Quay key fields from the version.
 * @param version
 */
function cleanQuayKey(version: QuayVersionSpecifier): QuayVersionSpecifier {
  return pick(version, 'netexId', 'version');
}

function getNewEnrichedStopPlaceCacheEntry(
  key: StopPlaceVersionSpecifier,
  stopPlaceDetails: DetailsForHistoricalStopVersionFragment,
): StopPlaceCacheEntry {
  return {
    key,
    status: 'fetched',
    value: {
      ...stopPlaceDetails,
      ...getStopPlaceDetailsForEnrichment({
        ...stopPlaceDetails,
        parentStopPlace: stopPlaceDetails.parentStopPlace
          ? [stopPlaceDetails.parentStopPlace as StopRegistryStopPlaceInterface]
          : undefined,
      }),
    },
  };
}

function getNewEnrichedQuayCacheEntries(
  stopPlaceDetails: DetailsForHistoricalStopVersionFragment,
): QuayCache {
  const enrichedQuays = compact(stopPlaceDetails.quays).map((quay) =>
    mapToEnrichedQuay(quay, stopPlaceDetails.accessibilityAssessment),
  );
  return compact(enrichedQuays).map((value) => ({
    key: { netexId: value.id ?? '', version: value.version ?? '' },
    status: 'fetched',
    value,
  }));
}

function updateCacheWithStopPlace(
  setCache: Dispatch<SetStateAction<EnrichedCache>>,
  key: StopPlaceVersionSpecifier,
  stopPlaceDetails: DetailsForHistoricalStopVersionFragment,
): void {
  setCache((p) => {
    const existingCacheEntry = p.stopPlaces.find(hasSameKey(key));

    // If stopPlace is already filled into the cache, don't replace it.
    // Associated Quays should also be in place.
    // -> Don't touch cache obj identity.
    if (existingCacheEntry?.status === 'fetched') {
      return p;
    }

    const stopPlaces: StopPlaceCache = p.stopPlaces
      .filter((existing) => existing !== existingCacheEntry)
      .concat(getNewEnrichedStopPlaceCacheEntry(key, stopPlaceDetails));

    const newQuayCacheEntries =
      getNewEnrichedQuayCacheEntries(stopPlaceDetails);
    const quays: QuayCache = p.quays
      .filter(({ key: existingKey }) =>
        none(hasSameKey(existingKey), newQuayCacheEntries),
      )
      .concat(newQuayCacheEntries);

    return { stopPlaces, quays };
  });
}

async function updateCacheWithStopPlaceFetchingError(
  setCache: Dispatch<SetStateAction<EnrichedCache>>,
  key: StopPlaceVersionSpecifier,
  error: unknown,
): Promise<void> {
  setCache((p) => {
    const existingCacheEntry = p.stopPlaces.find(hasSameKey(key));

    // If stopPlace is already filled into the cache, don't replace it.
    // Associated Quays should also be in place.
    // -> Don't touch cache onj identity.
    if (existingCacheEntry?.status === 'fetched') {
      return p;
    }

    return {
      quays: p.quays,
      stopPlaces: p.stopPlaces
        .filter((existing) => existing !== existingCacheEntry)
        .concat({ status: 'error', key, error, value: null }),
    };
  });
}

function useFetchRequestedData(
  { stopPlaces }: EnrichedCache,
  setCache: Dispatch<SetStateAction<EnrichedCache>>,
) {
  const getHistoricalStopPlace = useGetHistoricalStopPlace();

  useEffect(() => {
    const requested = stopPlaces.filter((it) => it.status === 'requested');

    if (requested.length === 0) {
      return;
    }

    // Mark request as in-flight.
    setCache((p) => {
      let changed = false;

      const updatedStopPlaceCache: StopPlaceCache = p.stopPlaces.map(
        (cacheEntry) => {
          // If a StopPlace has already been marked as fetched,
          // just leave it as is for now.
          const fetchTriggeringForEntry = requested.some(
            hasSameKey(cacheEntry.key),
          );

          if (fetchTriggeringForEntry) {
            if (
              cacheEntry.status !== 'fetched' &&
              cacheEntry.status !== 'fetching'
            ) {
              changed = true;
              return { key: cacheEntry.key, status: 'fetching', value: null };
            }
          }

          return cacheEntry;
        },
      );

      if (!changed) {
        return { quays: p.quays, stopPlaces: updatedStopPlaceCache };
      }

      return p;
    });

    requested.forEach(({ key }) =>
      getHistoricalStopPlace(key)
        .then((stopPlaceDetails) =>
          updateCacheWithStopPlace(setCache, key, stopPlaceDetails),
        )
        .catch((error) =>
          updateCacheWithStopPlaceFetchingError(setCache, key, error),
        ),
    );
  }, [stopPlaces, getHistoricalStopPlace, setCache]);
}

function useCreateHistoricalStopDataProviderContext(): HistoricalStopDataProviderContext {
  const [cache, setCache] = useState<EnrichedCache>({
    stopPlaces: [],
    quays: [],
  });

  useFetchRequestedData(cache, setCache);

  const request = useCallback((stopPlace: StopPlaceVersionSpecifier) => {
    setCache((p) => {
      // If we have already entered the StopPlace into the request-load-error-reload
      // loop, don't touch the cache.
      const existingCacheEntry = p.stopPlaces.find(hasSameKey(stopPlace));
      if (existingCacheEntry) {
        return p;
      }

      return {
        quays: p.quays,
        stopPlaces: p.stopPlaces.concat({
          status: 'requested',
          key: stopPlace,
          value: null,
        }),
      };
    });
  }, []);

  const refetchFailed = useCallback(() => {
    setCache((p) => {
      // Don't touch the cache if there are no errors.
      if (none((it) => it.status === 'error', p.stopPlaces)) {
        return p;
      }

      return {
        quays: p.quays,
        stopPlaces: p.stopPlaces.map((entry) => {
          if (entry.status === 'error') {
            return { key: entry.key, status: 'requested', value: null };
          }

          return entry;
        }),
      };
    });
  }, []);

  return { cache, request, refetchFailed };
}

export const HistoricalStopDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const context = useCreateHistoricalStopDataProviderContext();

  return (
    <HistoricalStopDataProviderContext.Provider value={context}>
      {children}
    </HistoricalStopDataProviderContext.Provider>
  );
};

type CachedHistoricalStop =
  | AsyncCacheDataFetching<HistoricalStopVersionSpecifier>
  | AsyncCacheDataFetched<HistoricalStopVersionSpecifier, HistoricalStopData>
  | AsyncCacheDataError<HistoricalStopVersionSpecifier>;

export function useHistoricalStopVersion(
  version: HistoricalStopVersionSpecifier,
): CachedHistoricalStop {
  const { cache, request } = useContext(HistoricalStopDataProviderContext);

  const stopPlaceKey = cleanStopPlaceKey(version);
  const stopPlace = cache.stopPlaces.find(hasSameKey(stopPlaceKey));
  const quay = cache.quays.find(hasSameKey(cleanQuayKey(version)));

  const pleaseRequest = !stopPlace;
  useEffect(() => {
    if (pleaseRequest) {
      request(stopPlaceKey);
    }
  }, [pleaseRequest, stopPlaceKey, request]);

  return useMemo(() => {
    // Not yet requested or recently requested, not yet in flight.
    // But from user point of view point the data is loading.
    // Or if the request is in-flight and loading data for real
    if (
      !stopPlace ||
      stopPlace.status === 'requested' ||
      stopPlace.status === 'fetching'
    ) {
      return { status: 'fetching', key: version, value: null };
    }

    if (stopPlace.status === 'error') {
      return {
        status: 'error',
        key: version,
        error: stopPlace.error,
        value: null,
      };
    }

    // Stop place has been loaded, but the requested quay has not been populated
    // into the cache. Should never happen unless someone takes a stab 🔪 at db.
    if (!quay) {
      return {
        status: 'error',
        key: version,
        error: new HistoricalStopDataCacheInconsistencyError(version),
        value: null,
      };
    }

    return {
      status: 'fetched',
      key: version,
      value: {
        stop_place: stopPlace.value,
        quay: quay.value,
      },
    };
  }, [stopPlace, quay, version]);
}

export function useRefetchFailedHistoricalStopVersions() {
  return useContext(HistoricalStopDataProviderContext).refetchFailed;
}
