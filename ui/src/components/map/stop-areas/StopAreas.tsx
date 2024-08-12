import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import {
  StopAreaMinimalShowOnMapFieldsFragment,
  StopRegistryGroupOfStopPlaces,
  useGetStopAreasByLocationQuery,
} from '../../../generated/graphql';
import {
  useAppAction,
  useAppSelector,
  useGetStopAreaById,
  useLoader,
  useUpsertStopArea,
} from '../../../hooks';
import {
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

  const { defaultErrorHandler, initializeStopArea } = useUpsertStopArea();
  const { setIsLoading } = useLoader(Operation.FetchStopAreas);

  const viewport = useAppSelector(selectMapViewport);
  const stopAreasResult = useGetStopAreasByLocationQuery({
    variables: {
      measured_location_filter: buildWithinViewportGqlGeometryFilter(viewport),
    },
  });

  const { getStopAreaById } = useGetStopAreaById();

  const fetchSelectedStopArea = useCallback(async () => {
    if (selectedStopAreaId) {
      const stopArea = await getStopAreaById(selectedStopAreaId);
      dispatch(setEditedStopAreaDataAction(stopArea));
    } else {
      dispatch(setEditedStopAreaDataAction(undefined));
    }
  }, [getStopAreaById, selectedStopAreaId, dispatch]);

  useEffect(() => {
    fetchSelectedStopArea();
  }, [selectedStopAreaId, fetchSelectedStopArea]);

  useEffect(() => {
    /**
     * Here we sync getStopAreasByLocationQuery query loading state with useLoader hook state.
     *
     * We could also use useLoader's immediatelyOn option instead of useEffect,
     * but using options to dynamically control loading state feels semantically wrong.
     */
    setIsLoading(stopAreasResult.loading);
  }, [setIsLoading, stopAreasResult.loading]);

  const onEditStopArea = (stopArea: StopRegistryGroupOfStopPlaces) => {
    setEditedStopAreaData(stopArea);
  };

  useImperativeHandle(ref, () => ({
    onCreateStopArea: async (e: MapLayerMouseEvent) => {
      setIsLoading(true);
      try {
        const stopAreaLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
        const newStopArea = initializeStopArea(stopAreaLocation);
        onEditStopArea(newStopArea);
        setIsCreateStopAreaModeEnabled(false);
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
      setIsLoading(false);
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
