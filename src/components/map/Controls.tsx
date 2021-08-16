import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

export type Position = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

const mapPositionToPositionClass = (position: Position) => {
  const positionClasses: Record<Position, string> = {
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
  };
  return positionClasses[position];
};

interface Props {
  position?: Position;
}

export const Controls: React.FC<Props> = ({
  position = 'topleft',
  children,
}) => {
  const positionClass = mapPositionToPositionClass(position);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Avoid click events from leaking to the map behind this element
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
    }
  }, [containerRef]);

  return (
    <div className={positionClass} ref={containerRef}>
      <div className="leaflet-control">{children}</div>
    </div>
  );
};
