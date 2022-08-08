import React, { useEffect, useImperativeHandle, useContext } from 'react';
import { MapEvent, MapContext } from 'react-map-gl';
import {
  ServicePatternScheduledStopPoint,
  useGetStopsByLocationQuery,
} from '../../../generated/graphql';
import { StopWithLocation } from '../../../graphql';
import {
  useAppAction,
  useAppSelector,
  useCreateStop,
  useEditStop,
  useFilterStops,
  useLoader,
  useMapStops,
} from '../../../hooks';
import {
  Operation,
  selectEditedStopData,
  selectIsCreateStopModeEnabled,
  selectMapViewport,
  selectSelectedStopId,
  setEditedStopDataAction,
  setIsCreateStopModeEnabledAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { Priority } from '../../../types/Priority';
import {
  constructWithinViewportGqlFilter,
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
  mapToVariables,
} from '../../../utils';
import { geometryLineBetweenPoints } from '../mapUtils';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import { Stop } from './Stop';
import {
  addStopToInfraConnection,
  removeStopToInfraConnection,
} from './StopToInfraConnection';

const testIds = {
  stopMarker: (label: string, priority: Priority) =>
    `Map::Stops::stopMarker::${label}_${Priority[priority]}`,
};

export const Stops = React.forwardRef((props, ref) => {
  const { filter } = useFilterStops();
  const { map } = useContext(MapContext);

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const editedStopData = useAppSelector(selectEditedStopData);
  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setEditedStopData = useAppAction(setEditedStopDataAction);
  const setIsCreateStopModeEnabled = useAppAction(
    setIsCreateStopModeEnabledAction,
  );
  const { setIsLoading } = useLoader(Operation.FetchStops);

  const { getStopVehicleMode, getStopHighlighted } = useMapStops();

  const viewport = useAppSelector(selectMapViewport);

  const stopsResult = useGetStopsByLocationQuery(
    mapToVariables({
      measured_location_filter: constructWithinViewportGqlFilter(viewport),
    }),
  );

  useEffect(() => {
    /**
     * Here we sync getStopsByLocation query loading state with useLoader hook state.
     *
     * We could also use useLoader's immediatelyOn option instead of useEffect,
     * but using options to dynamically control loading state feels semantically wrong.
     */
    setIsLoading(stopsResult.loading);
  }, [setIsLoading, stopsResult.loading]);

  // When stops are loading, show previously loaded stops to avoid stops
  // disappearing and flickering on every map move / zoom
  const unfilteredStops = (
    stopsResult.loading
      ? stopsResult.previousData?.service_pattern_scheduled_stop_point
      : stopsResult.data?.service_pattern_scheduled_stop_point
  ) as ServicePatternScheduledStopPoint[];
  const stops = filter(unfilteredStops || []);

  // can be used for triggering the edit for both existing and draft stops
  const onEditStop = (stop: StopWithLocation) => {
    if (stop.closest_point_on_infrastructure_link) {
      const nearestRoad = geometryLineBetweenPoints(
        stop.measured_location.coordinates,
        stop.closest_point_on_infrastructure_link.coordinates,
      );
      addStopToInfraConnection(map, nearestRoad);
    }

    setSelectedStopId(stop.scheduled_stop_point_id || undefined);
    setEditedStopData(stop);
  };

  const { createDraftStop } = useCreateStop();
  const { defaultErrorHandler } = useEditStop();
  useImperativeHandle(ref, () => ({
    onCreateStop: async (e: MapEvent) => {
      setIsLoading(true);
      try {
        const stopLocation = mapLngLatToGeoJSON(e.lngLat);
        const draftStop = await createDraftStop(stopLocation);
        onEditStop(draftStop);
        setIsCreateStopModeEnabled(false);
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
      setIsLoading(false);
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
            testId={testIds.stopMarker(item.label, item.priority)}
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
          onPopupClose={() => removeStopToInfraConnection(map)}
        />
      )}
      {/* Display hovering bus stop while in create mode */}
      {isCreateStopModeEnabled && <CreateStopMarker />}
    </>
  );
});

Stops.displayName = 'Stops';
