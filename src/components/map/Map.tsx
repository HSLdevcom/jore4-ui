import { LatLngExpression } from 'leaflet';
import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { CircleLayer } from './CircleLayer';
import { EditLayer } from './EditLayer';
import { Filters } from './Filters';

export interface Props {
  center?: LatLngExpression;
}

const helsinkiCityCenter: LatLngExpression = [60.1716, 24.9409];

export const Map: React.FC<Props> = ({ center = helsinkiCityCenter }) => {
  return (
    <MapContainer
      center={center}
      zoom={15}
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
      <Filters position="topleft" />
    </MapContainer>
  );
};
