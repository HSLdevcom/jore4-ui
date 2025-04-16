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
  MapEntityType,
  Operation,
  selectDraftLocation,
  selectIsCreateStopModeEnabled,
  selectIsMoveStopModeEnabled,
  selectMapViewport,
  selectSelectedStopId,
  selectShowMapEntityTypes,
  selectStopAreaEditorIsActive,
  setDraftLocationAction,
  setIsCreateStopModeEnabledAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { mapLngLatToGeoJSON, mapLngLatToPoint } from '../../../utils';
import { EditStoplayerRef } from '../refTypes';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import { Stop } from './Stop';
import { StopEditorViews } from './StopEditorViews';
import { useFilterStops } from './useFilterStops';
import { MapStop, useGetMapStops } from './useGetMapStops';

const testIds = {
  stopMarker: (label: string, priority: Priority) =>
    `Map::Stops::stopMarker::${label}_${Priority[priority]}`,
};

export const Stops = React.forwardRef((_props, ref) => {
  const [displayedEditor, setDisplayedEditor] = useState<StopEditorViews>(
    StopEditorViews.None,
  );

  const filter = useFilterStops();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const draftLocation = useAppSelector(selectDraftLocation);
  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);
  const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);
  const stopAreaEditorIsActive = useAppSelector(selectStopAreaEditorIsActive);
  const { [MapEntityType.Stop]: showStops } = useAppSelector(
    selectShowMapEntityTypes,
  );

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setDraftStopLocation = useAppAction(setDraftLocationAction);
  const setIsCreateStopModeEnabled = useAppAction(
    setIsCreateStopModeEnabledAction,
  );

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
        setIsCreateStopModeEnabled(false);
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
    if (displayedEditor !== StopEditorViews.Modal) {
      setSelectedStopId(stop.netex_id);
    }
  };

  const onPopupClose = () => {
    setSelectedStopId(undefined);
    setDraftStopLocation(undefined);
  };

  const onEditingFinished = async () => {
    // the newly created stop should become a regular stop from a draft
    // also, the recently edited stop's data is refetched
    setDraftStopLocation(undefined);
    await refetchStops();
    setIsLoadingSaveStop(false);
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
            testId={testIds.stopMarker(item.label, item.priority)}
            key={item.netex_id}
            selected={item.netex_id === selectedStopId}
            longitude={point.longitude}
            latitude={point.latitude}
            onClick={() => onClickStop(item)}
            isHighlighted={getStopHighlighted(item.netex_id)}
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
          displayedEditor={displayedEditor}
          setDisplayedEditor={setDisplayedEditor}
        />
      )}
      {/* Display hovering bus stop while in create mode */}
      {(isCreateStopModeEnabled || isMoveStopModeEnabled) && (
        <CreateStopMarker />
      )}
    </>
  );
});

Stops.displayName = 'Stops';
