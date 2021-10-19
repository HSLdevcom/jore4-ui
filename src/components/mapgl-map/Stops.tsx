import produce from 'immer';
import React, { useCallback, useImperativeHandle, useState } from 'react';
import { MapEvent } from 'react-map-gl';
import { Point } from '../../types';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

interface PopupInfo extends Point {
  index: number;
}

const mapLngLatToPoint = (lngLat: number[]): Point => {
  if (lngLat.length !== 2) {
    throw new Error(
      `Expected lngLat to be like [number, number] but got ${lngLat}`,
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

  const [stops, setStops] = useState<Point[]>([
    { latitude: 60.1716, longitude: 24.9409 },
  ]);

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
          onDelete={() => {
            onRemoveStop(popupInfo.index);
          }}
          onClose={onClosePopup}
        />
      )}
    </>
  );
});
