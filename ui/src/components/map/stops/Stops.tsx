import React, { useImperativeHandle, useRef, useState } from 'react';
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
  MapEntityType,
  Operation,
  isPlacingOrMoving,
  selectDraftLocation,
  selectMapStopViewState,
  selectMapViewport,
  selectSelectedStopId,
  selectShowMapEntityTypes,
  selectStopAreaEditorIsActive,
  setDraftLocationAction,
  setMapStopViewStateAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { mapLngLatToGeoJSON, mapLngLatToPoint } from '../../../utils';
import { EditStoplayerRef } from '../refTypes';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import { Stop } from './Stop';
import { useFilterStops } from './useFilterStops';
import { MapStop, useGetMapStops } from './useGetMapStops';

const testIds = {
  stopMarker: (label: string, priority: Priority) =>
    `Map::Stops::stopMarker::${label}_${Priority[priority]}`,
};

export const Stops = React.forwardRef((_props, ref) => {
  const filter = useFilterStops();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const draftLocation = useAppSelector(selectDraftLocation);
  const stopAreaEditorIsActive = useAppSelector(selectStopAreaEditorIsActive);
  const { [MapEntityType.Stop]: showStops } = useAppSelector(
    selectShowMapEntityTypes,
  );

  const mapStopViewState = useAppSelector(selectMapStopViewState);
  const setMapStopViewState = useAppAction(setMapStopViewStateAction);

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setDraftStopLocation = useAppAction(setDraftLocationAction);

  const editStopLayerRef = useRef<EditStoplayerRef>(null);

  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

  const { getStopVehicleMode, getStopHighlighted } = useMapStops();

  const viewport = useAppSelector(selectMapViewport);
  // Skip initial 0 radius fetch and wait for the map to get loaded,
  // so that we have a proper viewport.
  const skipFetching =
    !showStops || stopAreaEditorIsActive || viewport.radius <= 0;
  const {
    stops: unfilteredStops,
    setFetchStopsLoadingState,
    refetch: refetchStops,
  } = useGetMapStops({
    viewport,
    skipFetching,
  });
  const stops = filter(unfilteredStops);

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
    onMoveStop: (e: MapLayerMouseEvent) => {
      editStopLayerRef.current?.onMoveStop(e);
    },
  }));

  const onClickStop = (stop: MapStop) => {
    if (mapStopViewState === MapEntityEditorViewState.NONE) {
      setSelectedStopId(stop.netex_id);
    }
  };

  const onPopupClose = () => {
    setSelectedStopId(undefined);
    setDraftStopLocation(undefined);
  };

  const onEditingFinished = async (netextId: string | null) => {
    // the newly created stop should become a regular stop from a draft
    // also, the recently edited stop's data is refetched
    setDraftStopLocation(undefined);
    if (netextId) {
      setSelectedStopId(netextId);
      setMapStopViewState(MapEntityEditorViewState.POPUP);
    }
    await refetchStops();
    setIsLoadingSaveStop(false);
  };

  const onCancelMoveOrPlacement = () => {
    setMapStopViewState(
      selectedStopId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    );
  };

  if (stopAreaEditorIsActive) {
    return null;
  }

  return (
    <>
      {/* Display existing stops */}
      {stops?.map((item) => {
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
});

Stops.displayName = 'Stops';
