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
  useGetStopAreaById,
  useLoader,
  useMapDataLayerSimpleQueryLoader,
  useUpsertStopArea,
} from '../../../hooks';
import {
  LoadingState,
  Operation,
  selectEditedStopAreaData,
  selectIsCreateStopAreaModeEnabled,
  selectIsMoveStopAreaModeEnabled,
  selectMapViewport,
  selectSelectedStopAreaId,
  setEditedStopAreaDataAction,
  setIsCreateStopAreaModeEnabledAction,
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
  const isCreateStopAreaModeEnabled = useAppSelector(
    selectIsCreateStopAreaModeEnabled,
  );
  const isMoveStopAreaModeEnabled = useAppSelector(
    selectIsMoveStopAreaModeEnabled,
  );
  const setIsCreateStopAreaModeEnabled = useAppAction(
    setIsCreateStopAreaModeEnabledAction,
  );

  const { defaultErrorHandler, initializeStopArea } = useUpsertStopArea();

  const viewport = useAppSelector(selectMapViewport);
  // Skip initial 0 radius fetch and wait for the map to get loaded,
  // so that we have a proper viewport.
  const skipFetchingAreas = viewport.radius <= 0;
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
  const { getStopAreaById } = useGetStopAreaById();

  useEffect(() => {
    setFetchStopAreaDetailsLoadingState(LoadingState.MediumPriority);

    const cleanupHelper = makePromiseCleanupHelper();
    const basePromise = selectedStopAreaId
      ? getStopAreaById(selectedStopAreaId)
      : Promise.resolve(undefined);

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
    getStopAreaById,
    dispatch,
    setFetchStopAreaDetailsLoadingState,
    defaultErrorHandler,
  ]);

  useImperativeHandle(ref, () => ({
    onCreateStopArea: (e: MapLayerMouseEvent) => {
      const stopAreaLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
      const newStopArea = initializeStopArea(stopAreaLocation);
      setEditedStopAreaData(newStopArea);
      setIsCreateStopAreaModeEnabled(false);
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

  const data = stopAreasResult.loading
    ? stopAreasResult.previousData
    : stopAreasResult.data;
  const areas = data?.stops_database?.areas?.filter(notNullish) ?? [];

  return (
    <>
      {areas.map((area) => (
        <StopArea
          area={area}
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
      {(isCreateStopAreaModeEnabled || isMoveStopAreaModeEnabled) && (
        <CreateStopAreaMarker />
      )}
    </>
  );
});

StopAreas.displayName = 'StopAreas';
