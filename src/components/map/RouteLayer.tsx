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
    <Source id="my-data" type="geojson" data={data}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Layer {...layerStyle} />
    </Source>
  );
};
