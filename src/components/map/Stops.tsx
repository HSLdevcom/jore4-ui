import produce from 'immer';
import React, { useCallback, useImperativeHandle, useState } from 'react';
import { MapEvent } from 'react-map-gl';
import { useGetStopsQuery } from '../../generated/graphql';
import { Point } from '../../types';
import { EditStopModal } from './EditStopModal';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

interface StopInfo extends Point {
  finnishName?: string;
}

interface PopupInfo extends StopInfo {
  index: number;
}

const mapLngLatToPoint = (lngLat: number[]): Point => {
  // allow for the z-coordinate to be passed, even though it is ignored
  if (lngLat.length < 2 || lngLat.length > 3) {
    throw new Error(
      `Expected lngLat to be like [number, number] or [number, number, number] but got ${lngLat}`,
    );
  }
  return { longitude: lngLat[0], latitude: lngLat[1] };
};

// eslint-disable-next-line react/display-name
export const Stops = React.forwardRef((props, ref) => {
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(
    null,
  );

  const onOpenPopup = (point: Point, index: number) => {
    setPopupInfo({ ...point, index });
    setSelectedLayerIndex(index);
  };

  const onClosePopup = () => {
    setPopupInfo(null);
    setSelectedLayerIndex(null);
  };

  const [stops, setStops] = useState<StopInfo[]>([]);

  // TODO: Fetch only the stops visible on the map
  useGetStopsQuery({
    onCompleted: (loadedStops) =>
      setStops(
        loadedStops.service_pattern_scheduled_stop_point.map((stop) => ({
          ...mapLngLatToPoint(stop.measured_location.coordinates),
          finnishName: stop.label || undefined,
        })),
      ),
  });

  const [showEditForm, setShowEditForm] = useState(false);

  useImperativeHandle(ref, () => ({
    onCreateStop: (e: MapEvent) => {
      const newItem = mapLngLatToPoint(e.lngLat);
      setStops([...stops, newItem]);
      onOpenPopup(newItem, stops.length);
    },
  }));

  const onRemoveStop = (index: number) => {
    const updatedStops = produce(stops, (draft) => {
      draft.splice(index, 1);
    });
    setStops(updatedStops);
    onClosePopup();
  };

  const onStopDragEnd = useCallback(
    (event, index) => {
      const updatedStops = produce(stops, (draft) => {
        draft[index] = mapLngLatToPoint(event.lngLat);
      });
      setStops(updatedStops);
    },
    [stops],
  );

  return (
    <>
      {stops.map((item, index) => (
        <Stop
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          selected={index === selectedLayerIndex}
          longitude={item.longitude}
          latitude={item.latitude}
          onClick={() => onOpenPopup(item, index)}
          onDragEnd={(e) => onStopDragEnd(e, index)}
          draggable
        />
      ))}
      {popupInfo && (
        <StopPopup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          finnishName={popupInfo.finnishName}
          onEdit={() => {
            setShowEditForm(true);
          }}
          onDelete={() => {
            onRemoveStop(popupInfo.index);
          }}
          onClose={onClosePopup}
        />
      )}
      {showEditForm && popupInfo && (
        <EditStopModal
          defaultValues={{
            finnishName: popupInfo.finnishName,
            latitude: popupInfo.latitude,
            longitude: popupInfo.longitude,
          }}
          onCancel={() => setShowEditForm(false)}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
});
