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
  selectSelectedStopAreaId,
  selectSelectedTerminalId,
  selectShowMapEntityTypes,
} from '../../../redux';
import { Viewport } from '../../../redux/types';
import { useGetMapStopAreas } from './useGetMapStopAreas';
import { useGetMapStops } from './useGetMapStops';
import { useGetMapTerminals } from './useGetMapTerminals';

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
    [MapEntityType.Terminal]: showTerminals,
  } = useAppSelector(selectShowMapEntityTypes);

  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);

  const skipFetchingStops = !showStops || !viewportIsLoaded;
  const { stops, loading: stopsAreLoading } = useGetMapStops({
    viewport,
    selectedStopAreaId,
    selectedTerminalId,
    skipFetching: skipFetchingStops,
  });

  const skipFetchingAreas = !showStopAreas || !viewportIsLoaded;
  const { areas, loading: areasAreLoading } = useGetMapStopAreas({
    skipFetching: skipFetchingAreas,
    viewport,
  });

  const skipFetchingTerminals = !showTerminals || !viewportIsLoaded;
  const { terminals, loading: terminalsAreLoading } = useGetMapTerminals({
    skipFetching: skipFetchingTerminals,
    viewport,
  });

  const { displayedRouteIds, loading: displayedRoutesAreLoading } =
    useGetRoutesDisplayedInMap();

  const { setLoadingState } = useLoader(Operation.LoadMapData, {
    initialState: LoadingState.HighPriority,
  });

  const loading =
    stopsAreLoading ||
    areasAreLoading ||
    terminalsAreLoading ||
    displayedRoutesAreLoading;
  useEffect(() => {
    setLoadingState(
      loading ? LoadingState.MediumPriority : LoadingState.NotLoading,
    );
  }, [loading, setLoadingState]);

  return { stops, areas, displayedRouteIds, terminals };
}
