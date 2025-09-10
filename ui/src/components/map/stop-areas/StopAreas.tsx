import {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useImperativeHandle,
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
  selectEditedStopAreaData,
  selectSelectedStopAreaId,
  setEditedStopAreaDataAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { mapLngLatToGeoJSON, none } from '../../../utils';
import { useUpsertStopArea } from '../../forms/stop-area';
import { useGetStopPlaceDetailsById } from '../../stop-registry/stop-areas/stop-area-details/useGetStopAreaDetails';
import { EditStopAreaLayerRef, StopAreasRef } from '../refTypes';
import { MapStopArea } from '../types';
import { useMapViewState } from '../utils/useMapViewState';
import { CreateStopAreaMarker } from './CreateStopAreaMarker';
import { EditStopAreaLayer } from './EditStopAreaLayer';
import { StopArea } from './StopArea';
import { useLoader } from '../../common/hooks/useLoader';

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

  const [mapViewState, setMapViewState] = useMapViewState();

  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);

  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);

  const { initializeStopArea } = useUpsertStopArea();

  useFetchAndUpdateSelectedStopAreaData();

  useImperativeHandle(ref, () => ({
    onCreateStopArea: async (e: MapLayerMouseEvent) => {
      const stopAreaLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
      const newStopArea = initializeStopArea(stopAreaLocation);
      setEditedStopAreaData(newStopArea);
      setMapViewState({ stopAreas: MapEntityEditorViewState.CREATE });
    },
    onMoveStopArea: async (e: MapLayerMouseEvent) => {
      editStopAreaLayerRef.current?.onMoveStopArea(e);
    },
  }));

  const onClick = (area: MapStopArea) => {
    if (none(isEditorOpen, mapViewState)) {
      if (!area.netex_id) {
        throw new Error('Stop area has no NetexID!');
      }

      setSelectedStopId(undefined);
      setSelectedTerminalId(undefined);
      setSelectedMapStopAreaId(area.netex_id);

      setMapViewState({
        stopAreas: MapEntityEditorViewState.POPUP,
        stops: MapEntityEditorViewState.NONE,
        terminals: MapEntityEditorViewState.NONE,
      });
    }
  };
  const onPopupClose = () => setSelectedMapStopAreaId(undefined);

  const onCancelMoveOrPlacement = () => {
    setMapViewState({
      stopAreas: selectedStopAreaId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    });
  };

  const isStopBeingEdited = isEditorOpen(mapViewState.stops);
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
          mapStopAreaViewState={mapViewState.stopAreas}
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

      {isPlacingOrMoving(mapViewState.stopAreas) && (
        <CreateStopAreaMarker onCancel={onCancelMoveOrPlacement} />
      )}
    </>
  );
};
export const StopAreas = forwardRef(StopAreasImpl);
