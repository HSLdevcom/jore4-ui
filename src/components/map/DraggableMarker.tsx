import { CircleMarker, LatLng } from 'leaflet';
import React, { useMemo, useRef } from 'react';
import { Marker, MarkerProps } from 'react-leaflet';

// based on https://react-leaflet.js.org/docs/example-draggable-marker

interface Props {
  position: MarkerProps['position'];
  onUpdate: (latlng: LatLng) => void;
}

export const DraggableMarker: React.FC<Props> = ({
  position,
  onUpdate,
  children,
}) => {
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
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      draggable
    >
      {children}
    </Marker>
  );
};
