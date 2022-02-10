import produce from 'immer';
import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useState,
} from 'react';
import { MapEvent } from 'react-map-gl';
import { MapEditorContext } from '../../context/MapEditorContext';
import {
  ServicePatternScheduledStopPoint,
  useGetStopsQuery,
  useRemoveStopMutation,
} from '../../generated/graphql';
import { mapGetStopsResult } from '../../graphql/queries';
import { Point } from '../../types';
import { mapToVariables, showToast } from '../../utils';
import { EditStopModal } from './EditStopModal';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

const mapLngLatToPoint = (lngLat: number[]): Point => {
  // allow for the z-coordinate to be passed, even though it is ignored
  if (lngLat.length < 2 || lngLat.length > 3) {
    throw new Error(
      `Expected lngLat to be like [number, number] or [number, number, number] but got ${lngLat}`,
    );
  }
  return { longitude: lngLat[0], latitude: lngLat[1] };
};

export const Stops = React.forwardRef((props, ref) => {
  // TODO: We might want to move these to MapEditorContext
  const [popupInfo, setPopupInfo] = useState<
    Partial<ServicePatternScheduledStopPoint> | undefined
  >();
  const [draftStop, setDraftStop] = useState<
    Partial<ServicePatternScheduledStopPoint> | undefined
  >();
  const [showEditForm, setShowEditForm] = useState(false);

  const {
    dispatch: mapEditorDispatch,
    state: { selectedStopId },
  } = useContext(MapEditorContext);
  // TODO: Fetch only the stops visible on the map?
  const stopsResult = useGetStopsQuery({});
  const stops = mapGetStopsResult(stopsResult);
  const [removeStopMutation] = useRemoveStopMutation();

  const setSelectedStopId = (id?: UUID) => {
    mapEditorDispatch({
      type: 'setState',
      payload: {
        selectedStopId: id,
      },
    });
  };

  const onOpenPopup = (point: Partial<ServicePatternScheduledStopPoint>) => {
    setPopupInfo(point);
    setSelectedStopId(point.scheduled_stop_point_id || undefined);
  };

  const onClosePopup = () => {
    setPopupInfo(undefined);
    setSelectedStopId(undefined);
  };

  useImperativeHandle(ref, () => ({
    onCreateStop: (e: MapEvent) => {
      const stop: Partial<ServicePatternScheduledStopPoint> = {
        measured_location: {
          coordinates: e.lngLat,
        },
      };

      setDraftStop(stop);
      onOpenPopup(stop);
    },
  }));

  const onRemoveStop = (id?: UUID) => {
    if (id) {
      // we are removing stop that is already stored to backend
      removeStopMutation({
        ...mapToVariables({ id }),
        update(cache) {
          // Remove stop from apollo's cache after deletion so that
          // it also disappears from ui.
          // TODO: probably we shouldn't have to do this manually or
          // at least we should have helper function for this.
          // Based on https://stackoverflow.com/a/66713628
          const cached = cache.identify({
            scheduled_stop_point_id: id,
            __typename: 'service_pattern_scheduled_stop_point',
          });
          // @ts-expect-error something
          cache.evict(cached);
          cache.gc();
        },
      });
    } else {
      // we are "removing" stop that isn't saved yet
      setDraftStop(undefined);
    }
    onClosePopup();
  };

  const onStopDragEnd = useCallback(
    (event, stopId) => {
      const existingStop = stops?.find(
        (item) => item.scheduled_stop_point_id === stopId,
      );
      if (!existingStop) {
        // eslint-disable-next-line no-console
        console.log('Something went wrong when trying to move stop', stopId);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedStop = produce(existingStop, (draft) => {
        draft.measured_location.coordinates = event.lngLat;
        // TODO: also fetch closest infra link id and
        // stop direction based on new coordinates and
        // set those here
      });
      showToast({
        type: 'danger',
        message: 'Moving stops by dragging is currently not supported',
      });
      // TODO: do mutation to move stop on backend
    },
    [stops],
  );

  return (
    <>
      {stops?.map((item) => {
        const point = mapLngLatToPoint(item.measured_location.coordinates);
        return (
          <Stop
            key={item.scheduled_stop_point_id}
            selected={item.scheduled_stop_point_id === selectedStopId}
            longitude={point.longitude}
            latitude={point.latitude}
            onClick={() => onOpenPopup(item)}
            onDragEnd={(e) => onStopDragEnd(e, item.scheduled_stop_point_id)}
            draggable
          />
        );
      })}
      {draftStop && (
        <Stop
          selected
          longitude={
            mapLngLatToPoint(draftStop.measured_location.coordinates).longitude
          }
          latitude={
            mapLngLatToPoint(draftStop.measured_location.coordinates).latitude
          }
          onClick={() => onOpenPopup(draftStop)}
          onDragEnd={() => null}
        />
      )}
      {popupInfo && (
        <StopPopup
          longitude={
            mapLngLatToPoint(popupInfo.measured_location.coordinates).longitude
          }
          latitude={
            mapLngLatToPoint(popupInfo.measured_location.coordinates).latitude
          }
          finnishName={popupInfo.label || ''}
          onEdit={() => {
            setShowEditForm(true);
          }}
          onDelete={() => {
            onRemoveStop(popupInfo.scheduled_stop_point_id || undefined);
          }}
          onClose={onClosePopup}
        />
      )}
      {showEditForm && popupInfo && (
        <EditStopModal
          defaultValues={{
            finnishName: popupInfo.label || '',
            latitude: mapLngLatToPoint(popupInfo.measured_location.coordinates)
              .latitude,
            longitude: mapLngLatToPoint(popupInfo.measured_location.coordinates)
              .longitude,
          }}
          onCancel={() => setShowEditForm(false)}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
});
