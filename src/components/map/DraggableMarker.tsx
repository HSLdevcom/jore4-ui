import { CircleMarker, LatLng } from 'leaflet';
import React, { useMemo, useRef } from 'react';
import { Marker, MarkerProps, Popup } from 'react-leaflet';
import { SimpleButton } from '../../uiComponents';

// based on https://react-leaflet.js.org/docs/example-draggable-marker

interface Props {
  position: MarkerProps['position'];
  onUpdate: (latlng: LatLng) => void;
  onDelete: () => void;
}

export const DraggableMarker = ({
  position,
  onUpdate,
  onDelete,
}: Props): JSX.Element => {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          // TODO: Which is correct type for Marker? Could that be typed already in useRef<T>?
          const latlng = (marker as CircleMarker).getLatLng();
          onUpdate(latlng);
        }
      },
    }),
    [onUpdate],
  );

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>
        <SimpleButton onClick={onDelete}>Delete</SimpleButton>
      </Popup>
    </Marker>
  );
};
