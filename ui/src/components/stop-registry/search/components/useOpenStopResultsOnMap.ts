import { gql, useApolloClient } from '@apollo/client';
import {
  Units,
  bbox,
  centerOfMass,
  destination,
  distance,
  geometryCollection,
} from '@turf/turf';
import type { BBox, Geometry } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GetStopSearchResultDetailsForMapDocument,
  GetStopSearchResultDetailsForMapQuery,
  GetStopSearchResultDetailsForMapQueryVariables,
} from '../../../../generated/graphql';
import { useAppDispatch } from '../../../../hooks';
import {
  FilterType,
  MapEntityType,
  MutableViewport,
  defaultViewPort as defaultReduxMapViewPort,
  resetMapState,
  setShowMapEntityTypeFilterOverlayAction,
  setShowMapEntityTypesAction,
  setStopFiltersAction,
  setStopSelectionAction,
  setViewPortAction,
} from '../../../../redux';
import { Viewport as ReduxViewPort } from '../../../../redux/types';
import { ValidGeoJsonPoint, isValidGeoJSONPoint, log } from '../../../../utils';
import {
  ViewPortParams as UrlViewPort,
  defaultViewPortParams as defaultUrlViewPortParams,
} from '../../../map/types';
import { useNavigateToMap } from '../../../map/utils/useNavigateToMap';
import { StopSearchRow } from '../../components';
import { mapCompactOrNull } from '../../utils';
import { filtersAndResultSelectionToQueryVariables } from '../by-stop/filtersToQueryVariables';
import { ResultSelection, StopSearchFilters } from '../types';

const GQL_GET_STOP_SEARCH_RESULT_LOCATIONS = gql`
  query GetStopSearchResultDetailsForMap(
    $where: stops_database_quay_newest_version_bool_exp
  ) {
    stops_database {
      stops: stops_database_quay_newest_version(where: $where) {
        netexId: netex_id
        centroid

        # Prepopulate Selection component details into the cache
        ...StopSelectionInfo
      }
    }
  }
`;

function useSetupMapReduxStore() {
  const dispatch = useAppDispatch();

  return useCallback(
    (viewPort: ReduxViewPort, selectedStops: Array<string>) => {
      dispatch(resetMapState());

      dispatch(setShowMapEntityTypeFilterOverlayAction(false));

      dispatch(
        setStopFiltersAction({
          [FilterType.ShowFutureStops]: true,
          [FilterType.ShowCurrentStops]: true,
          [FilterType.ShowPastStops]: true,
          [FilterType.ShowStandardStops]: true,
          [FilterType.ShowTemporaryStops]: true,
          [FilterType.ShowDraftStops]: true,
          [FilterType.ShowHighestPriorityCurrentStops]: false,
          [FilterType.ShowAllBusStops]: true,
          [FilterType.ShowAllTramStops]: true,
        }),
      );

      dispatch(
        setShowMapEntityTypesAction({
          [MapEntityType.Stop]: true,
          [MapEntityType.StopArea]: false,
          [MapEntityType.Terminal]: false,
          [MapEntityType.InfoSpot]: false,
          [MapEntityType.Network]: false,
        }),
      );

      dispatch(setViewPortAction(viewPort as MutableViewport));

      dispatch(
        setStopSelectionAction({
          byResultSelection: false,
          selected: selectedStops,
        }),
      );
    },
    [dispatch],
  );
}

type ResolvedViewPortParams = {
  readonly redux: ReduxViewPort;
  readonly url: UrlViewPort;
};

const defaultResolvedViewPortParams: ResolvedViewPortParams = {
  redux: defaultReduxMapViewPort,
  url: defaultUrlViewPortParams,
};

const units: Units = 'meters';

function getPaddedBBox(geometry: Geometry): BBox {
  const [west, south, east, nort] = bbox(geometry);

  const cornerDistance = distance([west, south], [east, nort], { units });
  const padding = Math.max(200, 0.1 * cornerDistance);
  const paddedSw = destination([west, south], padding, -135, { units });
  const paddedNe = destination([east, nort], padding, 45, { units });

  return [
    paddedSw.geometry.coordinates[0],
    paddedSw.geometry.coordinates[1],
    paddedNe.geometry.coordinates[0],
    paddedNe.geometry.coordinates[1],
  ];
}

function resolveViewPortInfo(
  geometry: Geometry | null,
): ResolvedViewPortParams {
  if (!geometry) {
    return defaultResolvedViewPortParams;
  }

  const [longitude, latitude] = centerOfMass(geometry).geometry.coordinates;
  const [west, south, east, nort] = getPaddedBBox(geometry);

  return {
    url: {
      longitude,
      latitude,
      zoom: 13,
    },
    redux: {
      longitude,
      latitude,
      bounds: [
        [west, south],
        [east, nort],
      ],
    },
  };
}

function filterKnownResultBySelection(
  results: ReadonlyArray<StopSearchRow>,
  { selectionState, excluded, included }: ResultSelection,
): ReadonlyArray<StopSearchRow> {
  if (selectionState === 'NONE_SELECTED') {
    throw new Error(
      "Unexpected selection state. Can't open the map if nothing is selected!",
    );
  }

  if (selectionState === 'ALL_SELECTED') {
    return results;
  }

  if (excluded.length) {
    return results.filter((it) => !excluded.includes(it.id));
  }

  return results.filter((it) => included.includes(it.id));
}

function resultsToGeometry(results: ReadonlyArray<StopSearchRow>): Geometry {
  return geometryCollection(results.map((stop) => stop.location)).geometry;
}

type IdAndCentroid = {
  readonly netexId: string;
  readonly centroid: ValidGeoJsonPoint;
};

function useResolveAllResultDetailsForMap() {
  const apollo = useApolloClient();

  return useCallback(
    async (
      filters: StopSearchFilters,
      resultSelection: ResultSelection,
    ): Promise<Array<IdAndCentroid> | null> => {
      const result = await apollo.query<
        GetStopSearchResultDetailsForMapQuery,
        GetStopSearchResultDetailsForMapQueryVariables
      >({
        query: GetStopSearchResultDetailsForMapDocument,
        variables: {
          where: filtersAndResultSelectionToQueryVariables(
            filters,
            resultSelection,
          ),
        },
      });

      return mapCompactOrNull(
        result.data?.stops_database?.stops,
        ({ centroid, netexId }): IdAndCentroid | null => {
          if (isValidGeoJSONPoint(centroid) && netexId) {
            return { centroid, netexId };
          }

          return null;
        },
      );
    },
    [apollo],
  );
}

type ByStopResultParams = {
  readonly resultCount: number;
  readonly results: ReadonlyArray<StopSearchRow>;
};

export type OpenStopResultsOnMapParams = {
  readonly filters: StopSearchFilters;
  readonly resultSelection: ResultSelection;
} & (
  | ByStopResultParams
  | { readonly [key in keyof ByStopResultParams]?: never }
);

type ResultInfo = {
  readonly netexIds: Array<string>;
  readonly geometry: Geometry;
};

function useResolveResultInfo() {
  const resolveAllResultDetailsForMap = useResolveAllResultDetailsForMap();

  return useCallback(
    async ({
      filters,
      resultSelection,
      resultCount,
      results,
    }: OpenStopResultsOnMapParams): Promise<ResultInfo | null> => {
      // We already know all the results → Zoom in onto them
      if (results && results.length === resultCount) {
        const filtered = filterKnownResultBySelection(results, resultSelection);

        return {
          netexIds: filtered.map((it) => it.netexId),
          geometry: resultsToGeometry(filtered),
        };
      }

      // Try to fetch all the results
      const allResultDetails = await resolveAllResultDetailsForMap(
        filters,
        resultSelection,
      );

      if (!allResultDetails) {
        return null;
      }

      return {
        netexIds: allResultDetails.map((it) => it.netexId),
        geometry: geometryCollection(allResultDetails.map((it) => it.centroid))
          .geometry,
      };
    },
    [resolveAllResultDetailsForMap],
  );
}

export function useOpenStopResultsOnMap(
  params: OpenStopResultsOnMapParams,
): readonly [boolean, () => void] {
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolveResultInfo = useResolveResultInfo();
  const navigateToMap = useNavigateToMap();
  const setupMapReduxStore = useSetupMapReduxStore();

  const { filters, resultSelection, results } = params;

  // Cancel the pending transition if the municipality resolving takes time
  // and the user then does another search while it is processing.
  useEffect(() => {
    setTransitioning(false);
    if (transitionRef.current !== null) {
      clearTimeout(transitionRef.current);
    }
    transitionRef.current = null;
  }, [filters, results]);

  const transitionToMap = () => {
    setTransitioning(true);

    const initialAsyncScheduler = setTimeout(async () => {
      try {
        const resultInfo = await resolveResultInfo(params);

        // Unable to resolve the result geometry for whatever reason.
        // Nothing to show on the map.
        if (!resultInfo) {
          return;
        }

        // The transition was canceled while resolving resultset bounds.
        if (transitionRef.current !== initialAsyncScheduler) {
          return;
        }

        const { url: urlViewPort, redux: reduxViewPort } = resolveViewPortInfo(
          resultInfo.geometry,
        );

        setupMapReduxStore(reduxViewPort, resultInfo.netexIds);
        navigateToMap({
          viewPort: urlViewPort,
          filters,
          resultSelection,
        });
      } catch (e) {
        log.error(
          'Error resolving municipality for showing the search results on map!',
          e,
        );
      } finally {
        transitionRef.current = null;
      }
    }, 0);

    transitionRef.current = initialAsyncScheduler;
  };

  return [transitioning, transitionToMap];
}
