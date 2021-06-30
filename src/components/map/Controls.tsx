import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

// Classes used by Leaflet to position controls
export enum Position {
  TopLeft = 'leaflet-top leaflet-left',
  TopRight = 'leaflet-top leaflet-right',
  BottomLeft = 'leaflet-bottom leaflet-left',
  BottomRight = 'leaflet-bottom leaflet-right',
}

interface Props {
  position?: Position;
}

export const Controls: React.FC<Props> = ({
  position = Position.TopLeft,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Avoid click events from leaking to the map behind this element
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
    }
  }, [containerRef]);

  return (
    <div className={position} ref={containerRef}>
      <div className="leaflet-control">{children}</div>
    </div>
  );
};
