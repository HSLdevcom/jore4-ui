import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  LoadingState,
  MapEntityEditorViewState,
  Operation,
  isEditorOpen,
  isPlacingOrMoving,
  selectDraftLocation,
  selectMapStopSelection,
  selectSelectedStopAreaId,
  selectSelectedStopId,
  selectSelectedTerminalId,
  setDraftLocationAction,
  setEditedStopAreaDataAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { mapLngLatToPoint, mapPointToGeoJSON, none } from '../../../utils';
import { useLoader } from '../../common/hooks';
import { useResolveStopHoverTitle } from '../queries';
import { EditStoplayerRef, StopsRef } from '../refTypes';
import { MapStop, MapStopArea, MapTerminal } from '../types';
import { useIsInSearchResultMode } from '../utils/useIsInSearchResultMode';
import { useMapViewState } from '../utils/useMapViewState';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import {
  useCheckIsLocationValidForStop,
  useDefaultErrorHandler,
  useMapStops,
} from './hooks';
import { Stop } from './Stop';

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
  return useMemo(() => {
    if (selectedStopAreaId) {
      return stops.filter(
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

      return stops.filter((it) =>
        childAreaIds.includes(it.stop_place_netex_id),
      );
    }

    return stops;
  }, [selectedStopAreaId, selectedTerminalId, stops, terminals]);
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

  const isInSearchResultMode = useIsInSearchResultMode();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);
  const draftLocation = useAppSelector(selectDraftLocation);
  const mapStopSelection = useAppSelector(selectMapStopSelection);

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

  const handleStopAction = async (
    e: MapLayerMouseEvent,
    stopState: MapEntityEditorViewState,
  ) => {
    setFetchStopsLoadingState(LoadingState.HighPriority);

    try {
      const stopLocation = mapLngLatToPoint(e.lngLat.toArray());
      await checkIsLocationValidForStop(mapPointToGeoJSON(stopLocation));

      setDraftStopLocation({
        latitude: stopLocation.latitude,
        longitude: stopLocation.longitude,
      });
      setMapViewState({ stops: stopState });
    } catch (err) {
      defaultErrorHandler(err as Error);
    }

    setFetchStopsLoadingState(LoadingState.NotLoading);
  };

  useImperativeHandle(ref, () => ({
    onCreateStop: async (e: MapLayerMouseEvent) => {
      handleStopAction(e, MapEntityEditorViewState.CREATE);
    },
    onCopyStop: async (e: MapLayerMouseEvent) => {
      handleStopAction(e, MapEntityEditorViewState.COPY);
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

  const onEditingFinished = async (netexId: string | null) => {
    // the newly created stop should become a regular stop from a draft
    // also, the recently edited stop's data is refetched
    setDraftStopLocation(undefined);
    if (netexId) {
      setSelectedStopId(netexId);
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

  const selectedStops = mapStopSelection.byResultSelection
    ? []
    : mapStopSelection.selected;
  const isInSelection = (stop: MapStop) =>
    (isInSearchResultMode && mapStopSelection.byResultSelection) ||
    selectedStops.includes(stop.netex_id);

  return (
    <>
      {/* Display existing stops */}
      {filteredStops.map((item) => {
        const point = mapLngLatToPoint(item.location.coordinates);

        return (
          <Stop
            isHighlighted={getStopHighlighted(item)}
            inSelection={isInSelection(item)}
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
