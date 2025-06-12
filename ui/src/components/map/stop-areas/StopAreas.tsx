import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  LoadingState,
  MapEntityEditorViewState,
  Operation,
  isEditorOpen,
  isPlacingOrMoving,
  selectEditedStopAreaData,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectSelectedStopAreaId,
  setEditedStopAreaDataAction,
  setMapStopAreaViewStateAction,
  setMapStopViewStateAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { mapLngLatToGeoJSON } from '../../../utils';
import { useUpsertStopArea } from '../../forms/stop-area';
import { useGetStopPlaceDetailsById } from '../../stop-registry/stop-areas/stop-area-details/useGetStopAreaDetails';
import { EditStopAreaLayerRef, StopAreasRef } from '../refTypes';
import { MapStopArea } from '../types';
import { CreateStopAreaMarker } from './CreateStopAreaMarker';
import { EditStopAreaLayer } from './EditStopAreaLayer';
import { StopArea } from './StopArea';

function useFetchAndUpdateSelectedStopAreaData() {
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);

  const { setLoadingState } = useLoader(Operation.FetchStopAreaDetails);

  const { stopPlaceDetails, loading } =
    useGetStopPlaceDetailsById(selectedStopAreaId);

  useEffect(() => {
    setLoadingState(
      loading ? LoadingState.MediumPriority : LoadingState.NotLoading,
    );
  }, [loading, setLoadingState]);

  useEffect(() => {
    if (stopPlaceDetails) {
      setEditedStopAreaData(stopPlaceDetails);
    }
  }, [stopPlaceDetails, setEditedStopAreaData]);
}

type StopAreasProps = {
  readonly areas: ReadonlyArray<MapStopArea>;
};

const StopAreasImpl: ForwardRefRenderFunction<StopAreasRef, StopAreasProps> = (
  { areas },
  ref,
) => {
  const editStopAreaLayerRef = useRef<EditStopAreaLayerRef>(null);

  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);

  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);

  const mapStopViewState = useAppSelector(selectMapStopViewState);
  const setMapStopViewState = useAppAction(setMapStopViewStateAction);

  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);
  const setMapStopAreaViewState = useAppAction(setMapStopAreaViewStateAction);

  const { initializeStopArea } = useUpsertStopArea();

  useFetchAndUpdateSelectedStopAreaData();

  useImperativeHandle(ref, () => ({
    onCreateStopArea: async (e: MapLayerMouseEvent) => {
      const stopAreaLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
      const newStopArea = initializeStopArea(stopAreaLocation);
      setEditedStopAreaData(newStopArea);
      setMapStopAreaViewState(MapEntityEditorViewState.CREATE);
    },
    onMoveStopArea: async (e: MapLayerMouseEvent) => {
      editStopAreaLayerRef.current?.onMoveStopArea(e);
    },
  }));

  const onClick = (area: MapStopArea) => {
    if (isEditorOpen(mapStopViewState) || isEditorOpen(mapStopAreaViewState)) {
      return;
    }

    setMapStopViewState(MapEntityEditorViewState.NONE);
    setSelectedStopId(undefined);

    if (area.netex_id) {
      setSelectedMapStopAreaId(area.netex_id);
      setMapStopAreaViewState(MapEntityEditorViewState.POPUP);
    } else {
      setSelectedMapStopAreaId(undefined);
      setMapStopAreaViewState(MapEntityEditorViewState.NONE);
    }
  };
  const onPopupClose = () => setSelectedMapStopAreaId(undefined);

  const onCancelMoveOrPlacement = () => {
    setMapStopAreaViewState(
      selectedStopAreaId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    );
  };

  const isStopBeingEdited = isEditorOpen(mapStopViewState);
  // If creating a stop for a selected stop area, only show that one.
  const shownAreas =
    isStopBeingEdited && selectedStopAreaId
      ? areas.filter((area) => area.netex_id === selectedStopAreaId)
      : areas;

  return (
    <>
      {shownAreas.map((area) => (
        <StopArea
          area={area}
          mapStopAreaViewState={mapStopAreaViewState}
          selected={area.netex_id === selectedStopAreaId}
          key={area.id}
          onClick={onClick}
        />
      ))}

      {editedStopAreaData ? (
        <EditStopAreaLayer
          ref={editStopAreaLayerRef}
          editedArea={editedStopAreaData}
          onPopupClose={onPopupClose}
        />
      ) : null}

      {isPlacingOrMoving(mapStopAreaViewState) && (
        <CreateStopAreaMarker onCancel={onCancelMoveOrPlacement} />
      )}
    </>
  );
};
export const StopAreas = forwardRef(StopAreasImpl);
