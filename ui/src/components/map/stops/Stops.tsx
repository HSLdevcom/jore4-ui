import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import {
  useAppAction,
  useAppSelector,
  useCheckIsLocationValidForStop,
  useDefaultErrorHandler,
  useLoader,
  useMapStops,
} from '../../../hooks';
import {
  LoadingState,
  MapEntityEditorViewState,
  Operation,
  isEditorOpen,
  isPlacingOrMoving,
  selectDraftLocation,
  selectSelectedStopAreaId,
  selectSelectedStopId,
  selectSelectedTerminalId,
  setDraftLocationAction,
  setEditedStopAreaDataAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { mapLngLatToGeoJSON, mapLngLatToPoint, none } from '../../../utils';
import { useResolveStopHoverTitle } from '../queries';
import { EditStoplayerRef, StopsRef } from '../refTypes';
import { MapStop, MapStopArea, MapTerminal } from '../types';
import { useMapViewState } from '../utils/useMapViewState';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import { Stop } from './Stop';
import { useFilterStops } from './useFilterStops';

const testIds = {
  stopMarker: (label: string, priority: Priority) =>
    `Map::Stops::stopMarker::${label}_${Priority[priority]}`,
  memberStop: (label: string) => `Map::Stops::memberStop::${label}`,
};

function useFilteredStops(
  stops: ReadonlyArray<MapStop>,
  terminals: ReadonlyArray<MapTerminal>,
  selectedStopAreaId: string | undefined | null,
  selectedTerminalId: string | undefined | null,
): ReadonlyArray<MapStop> {
  const filterByUiFiltersAndRoute = useFilterStops();

  return useMemo(() => {
    const filteredStops = filterByUiFiltersAndRoute(stops);

    if (selectedStopAreaId) {
      return filteredStops.filter(
        (it) => it.stop_place_netex_id === selectedStopAreaId,
      );
    }

    if (selectedTerminalId) {
      const childAreaIds = terminals
        .find((it) => it.netex_id === selectedTerminalId)
        ?.children.map((it) => it.netexId);

      if (!childAreaIds?.length) {
        return [];
      }

      return filteredStops.filter((it) =>
        childAreaIds.includes(it.stop_place_netex_id),
      );
    }

    return filteredStops;
  }, [
    selectedStopAreaId,
    selectedTerminalId,
    filterByUiFiltersAndRoute,
    stops,
    terminals,
  ]);
}

type StopsProps = {
  readonly areas: ReadonlyArray<MapStopArea>;
  readonly displayedRouteIds: ReadonlyArray<string>;
  readonly stops: ReadonlyArray<MapStop>;
  readonly terminals: ReadonlyArray<MapTerminal>;
};

export const StopsImpl: ForwardRefRenderFunction<StopsRef, StopsProps> = (
  { areas, displayedRouteIds, stops, terminals },
  ref,
) => {
  const [mapViewState, setMapViewState] = useMapViewState();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);
  const draftLocation = useAppSelector(selectDraftLocation);

  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setDraftStopLocation = useAppAction(setDraftLocationAction);

  const editStopLayerRef = useRef<EditStoplayerRef>(null);

  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

  const { getStopVehicleMode, getStopHighlighted } =
    useMapStops(displayedRouteIds);

  const { setLoadingState: setFetchStopsLoadingState } = useLoader(
    Operation.FetchStops,
  );

  const checkIsLocationValidForStop = useCheckIsLocationValidForStop();
  const defaultErrorHandler = useDefaultErrorHandler();
  useImperativeHandle(ref, () => ({
    onCreateStop: async (e: MapLayerMouseEvent) => {
      setFetchStopsLoadingState(LoadingState.HighPriority);
      try {
        const stopLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
        await checkIsLocationValidForStop(stopLocation);
        setDraftStopLocation({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
        setMapViewState({ stops: MapEntityEditorViewState.CREATE });
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
      setFetchStopsLoadingState(LoadingState.NotLoading);
    },
    onMoveStop: async (e: MapLayerMouseEvent) => {
      editStopLayerRef.current?.onMoveStop(e);
    },
  }));

  const resolveStopHoverTitle = useResolveStopHoverTitle(areas);
  const onClickStop = (stop: MapStop) => {
    if (none(isEditorOpen, mapViewState)) {
      setSelectedStopId(stop.netex_id);
      setSelectedMapStopAreaId(stop.stop_place_netex_id);
      setMapViewState({
        stops: MapEntityEditorViewState.POPUP,
        stopAreas: MapEntityEditorViewState.NONE,
        terminals: MapEntityEditorViewState.NONE,
      });
    }
  };

  const onPopupClose = () => {
    setSelectedStopId(undefined);
    setDraftStopLocation(undefined);
    setSelectedMapStopAreaId(undefined);
    setEditedStopAreaData(undefined);
  };

  const onEditingFinished = async (netextId: string | null) => {
    // the newly created stop should become a regular stop from a draft
    // also, the recently edited stop's data is refetched
    setDraftStopLocation(undefined);
    if (netextId) {
      setSelectedStopId(netextId);
      setMapViewState({ stops: MapEntityEditorViewState.POPUP });
    }
    setIsLoadingSaveStop(false);
  };

  const onCancelMoveOrPlacement = () => {
    setMapViewState({
      stops: selectedStopId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    });
  };

  const filteredStops = useFilteredStops(
    stops,
    terminals,
    selectedStopAreaId,
    selectedTerminalId,
  );

  if (
    isEditorOpen(mapViewState.stopAreas) ||
    isEditorOpen(mapViewState.terminals)
  ) {
    return null;
  }

  const asMemberStop = !!(selectedStopAreaId ?? selectedTerminalId);

  return (
    <>
      {/* Display existing stops */}
      {filteredStops.map((item) => {
        const point = mapLngLatToPoint(item.location.coordinates);

        return (
          <Stop
            isHighlighted={getStopHighlighted(item)}
            asMemberStop={asMemberStop}
            key={item.netex_id}
            latitude={point.latitude}
            longitude={point.longitude}
            mapStopViewState={mapViewState.stops}
            onClick={onClickStop}
            onResolveTitle={resolveStopHoverTitle}
            stop={item}
            selected={item.netex_id === selectedStopId}
            testId={
              asMemberStop
                ? testIds.memberStop(item.label)
                : testIds.stopMarker(item.label, item.priority)
            }
            vehicleMode={getStopVehicleMode(item)}
          />
        );
      })}

      {/* Display edited stop + its editor components */}
      {(selectedStopId ?? draftLocation) && (
        <EditStopLayer
          ref={editStopLayerRef}
          selectedStopId={selectedStopId ?? null}
          draftLocation={draftLocation ?? null}
          onEditingFinished={onEditingFinished}
          onPopupClose={onPopupClose}
        />
      )}

      {/* Display hovering bus stop while in create mode */}
      {isPlacingOrMoving(mapViewState.stops) && (
        <CreateStopMarker onCancel={onCancelMoveOrPlacement} />
      )}
    </>
  );
};
export const Stops = forwardRef(StopsImpl);
