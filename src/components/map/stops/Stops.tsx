import React, { useImperativeHandle } from 'react';
import { MapEvent } from 'react-map-gl';
import { useGetStopsByLocationQuery } from '../../../generated/graphql';
import { mapGetStopsResult, StopWithLocation } from '../../../graphql';
import {
  useAppAction,
  useAppSelector,
  useCreateStop,
  useEditStop,
  useMapStops,
} from '../../../hooks';
import { useFilterStops } from '../../../hooks/useFilterStops';
import {
  selectEditedStopData,
  selectMapViewport,
  selectSelectedStopId,
  setEditedStopDataAction,
  setIsCreateStopModeEnabledAction,
  setSelectedStopIdAction,
} from '../../../redux';
import {
  constructWithinViewportGqlFilter,
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

  const { getStopVehicleMode, getStopHighlighted } = useMapStops();

  const viewport = useAppSelector(selectMapViewport);

  const stopsResult = useGetStopsByLocationQuery(
    mapToVariables({
      measured_location_filter: constructWithinViewportGqlFilter(viewport),
    }),
  );

  const unfilteredStops = mapGetStopsResult(stopsResult);
  const stops = filter(unfilteredStops || []);

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
            isHighlighted={getStopHighlighted(item.scheduled_stop_point_id)}
            onVehicleRoute={getStopVehicleMode(item)}
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

Stops.displayName = 'Stops';
