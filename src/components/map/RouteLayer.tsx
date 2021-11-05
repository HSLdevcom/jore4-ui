import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { routes } from '../../data';

interface Props {
  routeId: string;
}

export const RouteLayer = ({ routeId }: Props): JSX.Element => {
  const routeDb = routes;
  const { data } = routeDb[routeId as never];
  const layerStyle = {
    id: 'point',
    type: 'line' as const,
    paint: {},
  };
  return (
    <Source type="geojson" data={data}>
      <Layer {...layerStyle} />
    </Source>
  );
};
