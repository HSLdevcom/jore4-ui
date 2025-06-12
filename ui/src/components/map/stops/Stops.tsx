import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
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
  isNoneOrPopup,
  isPlacingOrMoving,
  selectDraftLocation,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectSelectedStopId,
  setDraftLocationAction,
  setEditedStopAreaDataAction,
  setMapStopViewStateAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { mapLngLatToGeoJSON, mapLngLatToPoint } from '../../../utils';
import { EditStoplayerRef, StopsRef } from '../refTypes';
import { MapStop } from '../types';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import { Stop } from './Stop';
import { useFilterStops } from './useFilterStops';

const testIds = {
  stopMarker: (label: string, priority: Priority) =>
    `Map::Stops::stopMarker::${label}_${Priority[priority]}`,
};

type StopsProps = {
  readonly displayedRouteIds: ReadonlyArray<string>;
  readonly stops: ReadonlyArray<MapStop>;
};

export const StopsImpl: ForwardRefRenderFunction<StopsRef, StopsProps> = (
  { displayedRouteIds, stops },
  ref,
) => {
  const filter = useFilterStops();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const draftLocation = useAppSelector(selectDraftLocation);
  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);

  const mapStopViewState = useAppSelector(selectMapStopViewState);
  const setMapStopViewState = useAppAction(setMapStopViewStateAction);

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
        setMapStopViewState(MapEntityEditorViewState.CREATE);
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
      setFetchStopsLoadingState(LoadingState.NotLoading);
    },
    onMoveStop: async (e: MapLayerMouseEvent) => {
      editStopLayerRef.current?.onMoveStop(e);
    },
  }));

  const onClickStop = (stop: MapStop) => {
    if (isNoneOrPopup(mapStopViewState)) {
      setSelectedStopId(stop.netex_id);
      setSelectedMapStopAreaId(stop.stop_place_netex_id);
      setMapStopViewState(MapEntityEditorViewState.POPUP);
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
      setMapStopViewState(MapEntityEditorViewState.POPUP);
    }
    setIsLoadingSaveStop(false);
  };

  const onCancelMoveOrPlacement = () => {
    setMapStopViewState(
      selectedStopId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    );
  };

  if (isEditorOpen(mapStopAreaViewState)) {
    return null;
  }

  const filteredStops = filter(stops);
  return (
    <>
      {/* Display existing stops */}
      {filteredStops?.map((item) => {
        const point = mapLngLatToPoint(item.location.coordinates);
        return (
          <Stop
            isHighlighted={getStopHighlighted(item.netex_id)}
            key={item.netex_id}
            latitude={point.latitude}
            longitude={point.longitude}
            mapStopViewState={mapStopViewState}
            onClick={() => onClickStop(item)}
            selected={item.netex_id === selectedStopId}
            testId={testIds.stopMarker(item.label, item.priority)}
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
      {isPlacingOrMoving(mapStopViewState) && (
        <CreateStopMarker onCancel={onCancelMoveOrPlacement} />
      )}
    </>
  );
};
export const Stops = forwardRef(StopsImpl);
