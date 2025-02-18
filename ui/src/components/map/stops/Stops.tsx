import React, { useImperativeHandle, useRef } from 'react';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { StopWithLocation } from '../../../graphql';
import {
  StopWithVehicleMode,
  useAppAction,
  useAppSelector,
  useCreateStop,
  useEditStop,
  useFilterStops,
  useLoader,
  useMapDataLayerSimpleQueryLoader,
  useMapStops,
} from '../../../hooks';
import {
  LoadingState,
  MapEntityType,
  Operation,
  selectEditedStopData,
  selectIsCreateStopModeEnabled,
  selectIsMoveStopModeEnabled,
  selectMapViewport,
  selectSelectedStopId,
  selectShowMapEntityTypes,
  selectStopAreaEditorIsActive,
  setEditedStopDataAction,
  setIsCreateStopModeEnabledAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { mapLngLatToGeoJSON, mapLngLatToPoint } from '../../../utils';
import {
  addLineFromStopToInfraLink,
  createGeometryLineBetweenPoints,
  removeLineFromStopToInfraLink,
} from '../../../utils/map';
import { EditStoplayerRef } from '../refTypes';
import { useMapData } from '../useMapData';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import { Stop } from './Stop';

const testIds = {
  stopMarker: (label: string, priority: Priority) =>
    `Map::Stops::stopMarker::${label}_${Priority[priority]}`,
};

export const Stops = React.forwardRef((_props, ref) => {
  const { filter } = useFilterStops();
  const { current: map } = useMap();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const editedStopData = useAppSelector(selectEditedStopData);
  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);
  const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);
  const stopAreaEditorIsActive = useAppSelector(selectStopAreaEditorIsActive);
  const { [MapEntityType.Stop]: showStops } = useAppSelector(
    selectShowMapEntityTypes,
  );

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setEditedStopData = useAppAction(setEditedStopDataAction);
  const setIsCreateStopModeEnabled = useAppAction(
    setIsCreateStopModeEnabledAction,
  );

  const editStopLayerRef = useRef<EditStoplayerRef>(null);

  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

  const { getStopVehicleMode, getStopHighlighted } = useMapStops();

  const viewport = useAppSelector(selectMapViewport);

  const mapData = useMapData(viewport);
  // Skip initial 0 radius fetch and wait for the map to get loaded,
  // so that we have a proper viewport.
  const skipFetching =
    !showStops || stopAreaEditorIsActive || viewport.radius <= 0;
  const stopsResult = mapData;

  const setFetchStopsLoadingState = useMapDataLayerSimpleQueryLoader(
    Operation.FetchStops,
    stopsResult,
    skipFetching,
  );

  // When stops are loading, show previously loaded stops to avoid stops
  // disappearing and flickering on every map move / zoom
  const unfilteredStops = stopsResult.loading
    ? stopsResult.previousData?.stopPoints
    : stopsResult.stopPoints;

  const stops = filter(unfilteredStops ?? []);

  // can be used for triggering the edit for both existing and draft stops
  const onEditStop = (stop: StopWithLocation) => {
    if (stop.closest_point_on_infrastructure_link) {
      const nearestRoad = createGeometryLineBetweenPoints(
        stop.measured_location.coordinates,
        stop.closest_point_on_infrastructure_link.coordinates,
      );
      addLineFromStopToInfraLink(map?.getMap(), nearestRoad);
    }

    setSelectedStopId(stop.scheduled_stop_point_id ?? undefined);
    setEditedStopData(stop);
  };

  const { createDraftStop } = useCreateStop();
  const { defaultErrorHandler } = useEditStop();
  useImperativeHandle(ref, () => ({
    onCreateStop: async (e: MapLayerMouseEvent) => {
      setFetchStopsLoadingState(LoadingState.HighPriority);
      try {
        const stopLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
        const draftStop = await createDraftStop(stopLocation);
        onEditStop(draftStop);
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

  const onEditingFinished = async () => {
    setEditedStopData(undefined);
    // the newly created stop should become a regular stop from a draft
    // also, the recently edited stop's data is refetched
    await stopsResult.refetch();
    setIsLoadingSaveStop(false);
  };

  if (stopAreaEditorIsActive) {
    return null;
  }

  return (
    <>
      {/* Display existing stops */}
      {stops?.map((item) => {
        const point = mapLngLatToPoint(item.measured_location.coordinates);
        return (
          <Stop
            testId={testIds.stopMarker(item.label, item.priority)}
            key={item.scheduled_stop_point_id}
            selected={item.scheduled_stop_point_id === selectedStopId}
            longitude={point.longitude}
            latitude={point.latitude}
            onClick={() => onEditStop(item as StopWithLocation)}
            isHighlighted={getStopHighlighted(item.scheduled_stop_point_id)}
            vehicleMode={getStopVehicleMode(item as StopWithVehicleMode)}
          />
        );
      })}
      {/* Display edited stop + its editor components */}
      {editedStopData && (
        <EditStopLayer
          ref={editStopLayerRef}
          editedStopData={editedStopData}
          onEditingFinished={onEditingFinished}
          onPopupClose={() => removeLineFromStopToInfraLink(map?.getMap())}
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
