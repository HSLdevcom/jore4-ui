import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { geojson1004 } from '../../data/1004x_w_r.geojson';

export const ExampleRoute: React.FC = () => {
  const layerStyle = {
    id: 'point',
    type: 'line' as const,
    paint: {},
  };
  return (
    <>
      <Source id="my-data" type="geojson" data={geojson1004 as never}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Layer {...layerStyle} />
      </Source>
    </>
  );
};
