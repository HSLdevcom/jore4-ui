import React, { useEffect, useImperativeHandle } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import {
  StopAreaMinimalShowOnMapFieldsFragment,
  useGetStopAreasByLocationQuery,
} from '../../../generated/graphql';
import {
  useAppAction,
  useAppSelector,
  useCreateStopArea,
  useGetStopAreaById,
  useLoader,
} from '../../../hooks';
import {
  LoadingState,
  Operation,
  selectEditedStopAreaData,
  selectIsCreateStopAreaModeEnabled,
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
import { CreateStopAreaMarker } from './CreateStopAreaMarker';
import { EditStopAreaLayer } from './EditStopAreaLayer';
import { MemberStops } from './MemberStops';
import { StopArea } from './StopArea';

export const StopAreas = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);
  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);

  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const isCreateStopAreaModeEnabled = useAppSelector(
    selectIsCreateStopAreaModeEnabled,
  );
  const setIsCreateStopAreaModeEnabled = useAppAction(
    setIsCreateStopAreaModeEnabledAction,
  );

  const { defaultErrorHandler, initializeStopArea } = useCreateStopArea();

  const { setLoadingState: setFetchAreasLoadingState } = useLoader(
    Operation.FetchStopAreas,
  );
  const viewport = useAppSelector(selectMapViewport);
  const stopAreasResult = useGetStopAreasByLocationQuery({
    variables: {
      measured_location_filter: buildWithinViewportGqlGeometryFilter(viewport),
    },
  });

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

  useEffect(() => {
    /**
     * Here we sync getStopAreasByLocationQuery query loading state with useLoader hook state.
     *
     * We could also use useLoader's immediatelyOn option instead of useEffect,
     * but using options to dynamically control loading state feels semantically wrong.
     */
    setFetchAreasLoadingState(
      stopAreasResult.loading
        ? LoadingState.LowPriority
        : LoadingState.NotLoading,
    );
  }, [setFetchAreasLoadingState, stopAreasResult.loading]);

  useImperativeHandle(ref, () => ({
    onCreateStopArea: (e: MapLayerMouseEvent) => {
      const stopAreaLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
      const newStopArea = initializeStopArea(stopAreaLocation);
      setEditedStopAreaData(newStopArea);
      setIsCreateStopAreaModeEnabled(false);
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
            editedArea={editedStopAreaData}
            onEditingFinished={onEditingFinished}
            onPopupClose={onPopupClose}
          />

          <MemberStops area={editedStopAreaData} />
        </>
      ) : null}
      {isCreateStopAreaModeEnabled && <CreateStopAreaMarker />}
    </>
  );
});

StopAreas.displayName = 'StopAreas';
