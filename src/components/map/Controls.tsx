import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

// Classes used by Leaflet to position controls
enum PositionClass {
  TopLeft = 'leaflet-top leaflet-left',
  TopRight = 'leaflet-top leaflet-right',
  BottomLeft = 'leaflet-bottom leaflet-left',
  BottomRight = 'leaflet-bottom leaflet-right',
}

export type Position = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

const mapPositionToPositionClass = (position: Position): PositionClass => {
  switch (position) {
    case 'topleft':
      return PositionClass.TopLeft;
    case 'topright':
      return PositionClass.TopRight;
    case 'bottomleft':
      return PositionClass.BottomLeft;
    case 'bottomright':
      return PositionClass.BottomRight;
    default:
      throw new Error(`Unknown position "${position}"`);
  }
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
