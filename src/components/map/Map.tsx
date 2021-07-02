import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { CircleLayer } from './CircleLayer';
import { EditLayer } from './EditLayer';

export interface Props {
  center?: [number, number];
}

export const Map: React.FC<Props> = ({ center = [60.2, 24.94] }) => {
  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{ minHeight: '75vh' }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        url="https://cdn.digitransit.fi/map/v1/hsl-map/{z}/{x}/{y}{r}.png"
      />
      <CircleLayer />
      <EditLayer />
    </MapContainer>
  );
};
