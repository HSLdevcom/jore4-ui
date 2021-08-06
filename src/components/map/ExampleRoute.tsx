import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { geojson1004 } from '../../data/1004x_w_r.geojson';

export const ExampleRoute: React.FC = () => {
  return <GeoJSON data={geojson1004} />;
};
