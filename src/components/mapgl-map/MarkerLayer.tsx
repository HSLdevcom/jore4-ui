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
export const MarkerLayer = React.forwardRef((props, ref) => {
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const onOpenPopup = (point: Point, index: number) => {
    setPopupInfo({ ...point, index });
  };

  const [markers, setMarkers] = useState<Point[]>([
    { latitude: 60.1716, longitude: 24.9409 },
  ]);

  useImperativeHandle(ref, () => ({
    onCreateMarker: (e: MapEvent) => {
      setMarkers([...markers, mapLngLatToPoint(e.lngLat)]);
    },
  }));

  const onDeleteMarker = (index: number) => {
    const updatedMarkers = produce(markers, (draft) => {
      draft.splice(index, 1);
    });
    setMarkers(updatedMarkers);
  };

  const onMarkerDragEnd = useCallback(
    (event, index) => {
      const updatedMarkers = produce(markers, (draft) => {
        draft[index] = mapLngLatToPoint(event.lngLat);
      });
      setMarkers(updatedMarkers);
    },
    [markers],
  );

  return (
    <>
      {markers.map((item, index) => (
        <Stop
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          longitude={item.longitude}
          latitude={item.latitude}
          onClick={() => onOpenPopup(item, index)}
          onDragEnd={(e) => onMarkerDragEnd(e, index)}
          draggable
        />
      ))}
      {popupInfo && (
        <StopPopup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onDelete={() => {
            onDeleteMarker(popupInfo.index);
          }}
          onClose={() => setPopupInfo(null)}
        />
      )}
    </>
  );
});
