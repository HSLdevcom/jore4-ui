import { useEffect } from 'react';
import {
  useAppSelector,
  useGetRoutesDisplayedInMap,
  useLoader,
} from '../../../hooks';
import {
  LoadingState,
  MapEntityType,
  Operation,
  selectMapViewport,
  selectShowMapEntityTypes,
} from '../../../redux';
import { Viewport } from '../../../redux/types';
import { useGetMapStopAreas } from './useGetMapStopAreas';
import { useGetMapStops } from './useGetMapStops';

function isViewportLoaded(viewport: Viewport): boolean {
  const [[west = 0, south = 0], [east = 0, north = 0]] = viewport.bounds;

  return Math.abs(west - east) > 0 && Math.abs(south - north) > 0;
}

export function useGetMapData() {
  const viewport = useAppSelector(selectMapViewport);
  const viewportIsLoaded = isViewportLoaded(viewport);

  const {
    [MapEntityType.Stop]: showStops,
    [MapEntityType.StopArea]: showStopAreas,
  } = useAppSelector(selectShowMapEntityTypes);

  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);

  const skipFetchingStops =
    !showStops ||
    mapStopAreaViewState !== MapEntityEditorViewState.NONE ||
    !viewportIsLoaded;
  const { stops, loading: stopsAreLoading } = useGetMapStops({
    viewport,
    skipFetching: skipFetchingStops,
  });

  const skipFetchingAreas = !showStopAreas || !viewportIsLoaded;
  const { areas, loading: areasAreLoading } = useGetMapStopAreas({
    skipFetching: skipFetchingAreas,
    viewport,
  });

  const { setLoadingState } = useLoader(Operation.LoadMapData, {
    initialState: LoadingState.HighPriority,
  });

  const { displayedRouteIds, loading: displayedRoutesAreLoading } =
    useGetRoutesDisplayedInMap();

  const loading =
    stopsAreLoading || areasAreLoading || displayedRoutesAreLoading;
  useEffect(() => {
    setLoadingState(
      loading ? LoadingState.MediumPriority : LoadingState.NotLoading,
    );
  }, [loading, setLoadingState]);

  return { stops, areas, displayedRouteIds };
}
