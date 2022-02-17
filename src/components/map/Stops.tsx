import produce from 'immer';
import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useState,
} from 'react';
import { MapEvent } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { MapEditorContext } from '../../context/MapEditorContext';
import {
  ServicePatternScheduledStopPoint,
  useGetStopsQuery,
  useRemoveStopMutation,
} from '../../generated/graphql';
import { mapGetStopsResult } from '../../graphql';
import { RequiredKeys } from '../../types';
import {
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
  mapToVariables,
  removeFromApolloCache,
  showToast,
} from '../../utils';
import { EditStopModal } from './EditStopModal';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

// draft stops only can only have a few attributes filled when placed, the rest is filled within the form
type DraftStop = RequiredKeys<
  Partial<ServicePatternScheduledStopPoint>,
  'measured_location'
>;

export const Stops = React.forwardRef((props, ref) => {
  // TODO: We might want to move these to MapEditorContext
  const [popupInfo, setPopupInfo] = useState<DraftStop | undefined>();
  const [draftStop, setDraftStop] = useState<DraftStop | undefined>();
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

  const onOpenPopup = (point: DraftStop) => {
    setPopupInfo(point);
    setSelectedStopId(point.scheduled_stop_point_id || undefined);
  };

  const onClosePopup = () => {
    setPopupInfo(undefined);
    setSelectedStopId(undefined);
  };

  useImperativeHandle(ref, () => ({
    onCreateStop: (e: MapEvent) => {
      const stop: DraftStop = {
        measured_location: mapLngLatToGeoJSON(e.lngLat),
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
        // remove stop from cache after mutation
        update(cache) {
          removeFromApolloCache(cache, {
            scheduled_stop_point_id: id,
            __typename: 'service_pattern_scheduled_stop_point',
          });
        },
      });
    } else {
      // we are "removing" stop that isn't saved yet
      setDraftStop(undefined);
    }
    onClosePopup();
  };

  const onStopDragEnd = useCallback<
    (event: CallbackEvent, stopId: UUID) => void
  >(
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
