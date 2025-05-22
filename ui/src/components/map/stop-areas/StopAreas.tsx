import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import {
  StopAreaMinimalShowOnMapFieldsFragment,
  useGetStopAreasByLocationQuery,
} from '../../../generated/graphql';
import {
  useAppAction,
  useAppSelector,
  useLoader,
  useMapDataLayerSimpleQueryLoader,
} from '../../../hooks';
import {
  LoadingState,
  MapEntityEditorViewState,
  MapEntityType,
  Operation,
  isEditorOpen,
  isPlacingOrMoving,
  selectEditedStopAreaData,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectMapViewport,
  selectSelectedStopAreaId,
  selectShowMapEntityTypes,
  setEditedStopAreaDataAction,
  setMapStopAreaViewStateAction,
  setMapStopViewStateAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import {
  buildWithinViewportGqlGeometryFilter,
  mapLngLatToGeoJSON,
  notNullish,
} from '../../../utils';
import { useUpsertStopArea } from '../../forms/stop-area';
import { useGetStopPlaceDetailsById } from '../../stop-registry/stop-areas/stop-area-details/useGetStopAreaDetails';
import { EditStopAreaLayerRef } from '../refTypes';
import { CreateStopAreaMarker } from './CreateStopAreaMarker';
import { EditStopAreaLayer } from './EditStopAreaLayer';
import { MemberStops } from './MemberStops';
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

export const StopAreas = React.forwardRef((_props, ref) => {
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

  const { [MapEntityType.StopArea]: showStopAreas } = useAppSelector(
    selectShowMapEntityTypes,
  );

  const { initializeStopArea } = useUpsertStopArea();

  const viewport = useAppSelector(selectMapViewport);
  // Skip initial 0 radius fetch and wait for the map to get loaded,
  // so that we have a proper viewport.
  const skipFetchingAreas = !showStopAreas || viewport.radius <= 0;
  const stopAreasResult = useGetStopAreasByLocationQuery({
    variables: {
      measured_location_filter: buildWithinViewportGqlGeometryFilter(viewport),
    },
    skip: skipFetchingAreas,
  });
  useMapDataLayerSimpleQueryLoader(
    Operation.FetchStopAreas,
    stopAreasResult,
    skipFetchingAreas,
  );

  useFetchAndUpdateSelectedStopAreaData();

  useImperativeHandle(ref, () => ({
    onCreateStopArea: (e: MapLayerMouseEvent) => {
      const stopAreaLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
      const newStopArea = initializeStopArea(stopAreaLocation);
      setEditedStopAreaData(newStopArea);
      setMapStopAreaViewState(MapEntityEditorViewState.CREATE);
    },
    onMoveStopArea: (e: MapLayerMouseEvent) => {
      editStopAreaLayerRef.current?.onMoveStopArea(e);
    },
  }));

  const onClick = (area: StopAreaMinimalShowOnMapFieldsFragment) => {
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
  const data = stopAreasResult.loading
    ? stopAreasResult.previousData
    : stopAreasResult.data;
  const areas =
    data?.stops_database?.areas?.filter(
      isStopBeingEdited && selectedStopAreaId
        ? // If creating a stop for a selected stop area, only show that one.
          (area) => notNullish(area) && area.netex_id === selectedStopAreaId
        : notNullish,
    ) ?? [];

  return (
    <>
      {areas.map((area) => (
        <StopArea
          area={area}
          mapStopAreaViewState={mapStopAreaViewState}
          selected={area.netex_id === selectedStopAreaId}
          key={area.id}
          onClick={onClick}
        />
      ))}

      {editedStopAreaData ? (
        <>
          <EditStopAreaLayer
            ref={editStopAreaLayerRef}
            editedArea={editedStopAreaData}
            onPopupClose={onPopupClose}
          />

          <MemberStops area={editedStopAreaData} />
        </>
      ) : null}

      {isPlacingOrMoving(mapStopAreaViewState) && (
        <CreateStopAreaMarker onCancel={onCancelMoveOrPlacement} />
      )}
    </>
  );
});

StopAreas.displayName = 'StopAreas';
