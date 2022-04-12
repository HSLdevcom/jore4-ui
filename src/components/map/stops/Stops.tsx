import React, { useImperativeHandle } from 'react';
import { MapEvent } from 'react-map-gl';
import {
  ReusableComponentsVehicleModeEnum,
  useGetRoutesWithInfrastructureLinksQuery,
  useGetStopsQuery,
} from '../../../generated/graphql';
import {
  getRouteStopIds,
  mapGetStopsResult,
  mapRoutesDetailsResult,
  StopWithLocation,
} from '../../../graphql';
import {
  useAppAction,
  useAppSelector,
  useCreateStop,
  useEditStop,
  useExtractRouteFromFeature,
  useGetDisplayedRoutes,
} from '../../../hooks';
import { useFilterStops } from '../../../hooks/useFilterStops';
import {
  selectEditedStopData,
  selectMapEditor,
  selectSelectedStopId,
  setEditedStopDataAction,
  setIsCreateStopModeEnabledAction,
  setSelectedStopIdAction,
} from '../../../redux';
import {
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
  mapToVariables,
} from '../../../utils';
import { EditStopLayer } from './EditStopLayer';
import { Stop } from './Stop';

export const Stops = React.forwardRef((props, ref) => {
  const { filter } = useFilterStops();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const editedStopData = useAppSelector(selectEditedStopData);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setEditedStopData = useAppAction(setEditedStopDataAction);
  const setIsCreateStopModeEnabled = useAppAction(
    setIsCreateStopModeEnabledAction,
  );

  const { editedRouteData, creatingNewRoute } = useAppSelector(selectMapEditor);

  const { displayedRouteIds } = useGetDisplayedRoutes();

  // TODO: Fetch only the stops visible on the map?
  const stopsResult = useGetStopsQuery({});
  const unfilteredStops = mapGetStopsResult(stopsResult);
  const stops = filter(unfilteredStops || []);

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds || [] }),
  );
  const routes = mapRoutesDetailsResult(routesResult);

  const { mapRouteStopsToStopIds } = useExtractRouteFromFeature();

  // If editing/creating a route, show stops along edited/created route,
  // otherwise show every stop belonging to visible routes
  const stopIdsWithinRoute =
    creatingNewRoute || editedRouteData.id
      ? mapRouteStopsToStopIds(editedRouteData.stops)
      : routes?.flatMap((route) => getRouteStopIds(route));

  // can be used for triggering the edit for both existing and draft stops
  const onEditStop = (stop: StopWithLocation) => {
    setSelectedStopId(stop.scheduled_stop_point_id || undefined);
    setEditedStopData(stop);
  };

  const { createDraftStop } = useCreateStop();
  const { defaultErrorHandler } = useEditStop();
  useImperativeHandle(ref, () => ({
    onCreateStop: async (e: MapEvent) => {
      try {
        const stopLocation = mapLngLatToGeoJSON(e.lngLat);
        const draftStop = await createDraftStop(stopLocation);
        onEditStop(draftStop);
        setIsCreateStopModeEnabled(false);
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
    },
  }));

  const onEditingFinished = async () => {
    setEditedStopData(undefined);
    // the newly created stop should become a regular stop from a draft
    // also, the recently edited stop's data is refetched
    await stopsResult.refetch();
  };

  return (
    <>
      {/* Display existing stops */}
      {stops?.map((item) => {
        const point = mapLngLatToPoint(item.measured_location.coordinates);
        return (
          <Stop
            key={item.scheduled_stop_point_id}
            selected={item.scheduled_stop_point_id === selectedStopId}
            longitude={point.longitude}
            latitude={point.latitude}
            onClick={() => onEditStop(item)}
            onVehicleRoute={
              stopIdsWithinRoute?.includes(item.scheduled_stop_point_id)
                ? ReusableComponentsVehicleModeEnum.Bus
                : undefined
            }
          />
        );
      })}
      {/* Display edited stop + its editor components */}
      {editedStopData && (
        <EditStopLayer
          editedStopData={editedStopData}
          onEditingFinished={onEditingFinished}
        />
      )}
    </>
  );
});
