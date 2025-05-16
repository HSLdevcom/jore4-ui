import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
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
  selectEditedStopAreaData,
  selectMapStopAreaViewState,
  selectMapViewport,
  selectSelectedStopAreaId,
  selectShowMapEntityTypes,
  setEditedStopAreaDataAction,
  setMapStopAreaViewStateAction,
  setSelectedMapStopAreaIdAction,
} from '../../../redux';
import {
  buildWithinViewportGqlGeometryFilter,
  mapLngLatToGeoJSON,
  notNullish,
} from '../../../utils';
import {
  filterCancellationError,
  makePromiseCleanupHelper,
} from '../../../utils/makePromiseCleanupHelper';
import { useUpsertStopArea } from '../../forms/stop-area';
import { useGetStopPlaceDetailsLazy } from '../../stop-registry/stop-areas/stop-area-details/useGetStopAreaDetails';
import { EditStopAreaLayerRef } from '../refTypes';
import { CreateStopAreaMarker } from './CreateStopAreaMarker';
import { EditStopAreaLayer } from './EditStopAreaLayer';
import { MemberStops } from './MemberStops';
import { StopArea } from './StopArea';

export const StopAreas = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);
  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);
  const editStopAreaLayerRef = useRef<EditStopAreaLayerRef>(null);

  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);

  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);
  const setMapStopAreaViewState = useAppAction(setMapStopAreaViewStateAction);

  const { [MapEntityType.StopArea]: showStopAreas } = useAppSelector(
    selectShowMapEntityTypes,
  );

  const { defaultErrorHandler, initializeStopArea } = useUpsertStopArea();

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

  const { setLoadingState: setFetchStopAreaDetailsLoadingState } = useLoader(
    Operation.FetchStopAreaDetails,
  );
  const getStopPlaceDetails = useGetStopPlaceDetailsLazy();

  useEffect(() => {
    setFetchStopAreaDetailsLoadingState(LoadingState.MediumPriority);

    const cleanupHelper = makePromiseCleanupHelper();
    const basePromise = selectedStopAreaId
      ? getStopPlaceDetails(selectedStopAreaId)
      : Promise.resolve(null);

    basePromise
      .then(cleanupHelper.blockOnCleanup)
      .then(setEditedStopAreaDataAction)
      .then(dispatch)
      .catch(filterCancellationError(defaultErrorHandler))
      .finally(() => {
        if (!cleanupHelper.cleanedUp) {
          setFetchStopAreaDetailsLoadingState(LoadingState.NotLoading);
        }
      });

    return cleanupHelper.cleanup;
  }, [
    selectedStopAreaId,
    getStopPlaceDetails,
    dispatch,
    setFetchStopAreaDetailsLoadingState,
    defaultErrorHandler,
  ]);

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

  const onEditingFinished = async () => {
    setEditedStopAreaData(undefined);

    // Refetch stop areas to include the newly created one.
    await stopAreasResult.refetch();
  };

  const onClick = (area: StopAreaMinimalShowOnMapFieldsFragment) =>
    setSelectedMapStopAreaId(area.netex_id ?? undefined);

  const onPopupClose = () => setSelectedMapStopAreaId(undefined);

  const onCancelMoveOrPlacement = () => {
    setMapStopAreaViewState(
      selectedStopAreaId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    );
  };

  const data = stopAreasResult.loading
    ? stopAreasResult.previousData
    : stopAreasResult.data;
  const areas = data?.stops_database?.areas?.filter(notNullish) ?? [];

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
            onEditingFinished={onEditingFinished}
            onPopupClose={onPopupClose}
          />

          <MemberStops area={editedStopAreaData} />
        </>
      ) : null}

      {(mapStopAreaViewState === MapEntityEditorViewState.PLACE ||
        mapStopAreaViewState === MapEntityEditorViewState.MOVE) && (
        <CreateStopAreaMarker onCancel={onCancelMoveOrPlacement} />
      )}
    </>
  );
});

StopAreas.displayName = 'StopAreas';
