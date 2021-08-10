import React from 'react';
import { Layer, Source } from 'react-map-gl';

export const PreRenderedRouteLayer: React.FC = () => {
  return (
    <Source
      type="vector"
      tiles={['http://localhost:3100/services/dr_linkki/tiles/{z}/{x}/{y}.pbf']}
    >
      <Layer
        {...{
          id: 'digiroad_r_links',
          type: 'line',
          source: 'dr_linkki',
          'source-layer': 'dr_linkki',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#0000ff',
            'line-width': 2,
          },
        }}
      />
    </Source>
  );
};
