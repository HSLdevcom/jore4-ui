import { gql } from '@apollo/client';
import {
  Units,
  bbox,
  centerOfMass,
  destination,
  distance,
  geometryCollection,
} from '@turf/turf';
import type { BBox, Geometry, Point } from 'geojson';
import compact from 'lodash/compact';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetStopSearchResultLocationsLazyQuery } from '../../../../generated/graphql';
import {
  FilterType,
  MapEntityType,
  MutableViewport,
  defaultViewPort as defaultReduxMapViewPort,
  setShowMapEntityTypeFilterOverlayAction,
  setShowMapEntityTypesAction,
  setStopFiltersAction,
  setViewPortAction,
} from '../../../../redux';
import { Viewport as ReduxViewPort } from '../../../../redux/types';
import { isValidGeoJSONPoint, log } from '../../../../utils';
import {
  ViewPortParams as UrlViewPort,
  defaultViewPortParams as defaultUrlViewPortParams,
} from '../../../map/types';
import { useNavigateToMap } from '../../../map/utils/useNavigateToMap';
import { StopSearchRow } from '../../components';
import { ResultSelection, StopSearchFilters } from '../types';
import { filtersAndResultSelectionToQueryVariables } from './filtersToQueryVariables';

const GQL_GET_STOP_SEARCH_RESULT_LOCATIONS = gql`
  query GetStopSearchResultLocations(
    $where: stops_database_quay_newest_version_bool_exp
  ) {
    stops_database {
      stops: stops_database_quay_newest_version(where: $where) {
        id
        centroid
      }
    }
  }
`;

function useSetupMapReduxStore() {
  const dispatch = useDispatch();

  return useCallback(
    (viewPort: ReduxViewPort) => {
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

function useResolveAllResultLocations() {
  const [searchStops] = useGetStopSearchResultLocationsLazyQuery();

  return useCallback(
    async (
      filters: StopSearchFilters,
      resultSelection: ResultSelection,
    ): Promise<Array<Point> | null> => {
      const result = await searchStops({
        variables: {
          where: filtersAndResultSelectionToQueryVariables(
            filters,
            resultSelection,
          ),
        },
      });

      const points = compact(
        result.data?.stops_database?.stops.map((it) => it.centroid),
      ).filter(isValidGeoJSONPoint);

      if (points.length === 0) {
        return null;
      }

      return points;
    },
    [searchStops],
  );
}

function useResolveResultGeometry() {
  const resolveAllResultLocations = useResolveAllResultLocations();

  return useCallback(
    async (
      filters: StopSearchFilters,
      resultSelection: ResultSelection,
      resultCount: number,
      results: ReadonlyArray<StopSearchRow>,
    ): Promise<Geometry> => {
      // We already know all the results → Zoom in onto them
      if (results.length === resultCount) {
        return resultsToGeometry(
          filterKnownResultBySelection(results, resultSelection),
        );
      }

      // Try to fetch all the results
      const allResultLocations = await resolveAllResultLocations(
        filters,
        resultSelection,
      );
      if (allResultLocations) {
        return geometryCollection(allResultLocations).geometry;
      }

      // Something went wrong, fallback to what we know
      return resultsToGeometry(results);
    },
    [resolveAllResultLocations],
  );
}

export function useOpenStopResultsOnMap(
  filters: StopSearchFilters,
  resultSelection: ResultSelection,
  resultCount: number,
  results: ReadonlyArray<StopSearchRow>,
): readonly [boolean, () => void] {
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolveResultGeometry = useResolveResultGeometry();
  const navigateToMap = useNavigateToMap();
  const setupMapReduxStore = useSetupMapReduxStore();

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
    // This should never happen.
    // The show button should be hidden if there are no results.
    if (results.length === 0) {
      return;
    }

    setTransitioning(true);

    const initialAsyncScheduler = setTimeout(async () => {
      try {
        const resultGeometry = await resolveResultGeometry(
          filters,
          resultSelection,
          resultCount,
          results,
        );

        // The transition was canceled while resolving resultset bounds.
        if (transitionRef.current !== initialAsyncScheduler) {
          return;
        }

        const { url: urlViewPort, redux: reduxViewPort } =
          resolveViewPortInfo(resultGeometry);

        setupMapReduxStore(reduxViewPort);
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
