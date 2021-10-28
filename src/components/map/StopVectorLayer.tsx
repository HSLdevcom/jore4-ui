import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { theme } from '../../generated/theme';

const { colors } = theme;

export const StopVectorLayer: React.FC = () => {
  return (
    <Source
      type="vector"
      tiles={['/api/mbtiles/services/dr_pysakki/tiles/{z}/{x}/{y}.pbf']}
    >
      <Layer
        {...{
          id: 'digiroad_r_pysakki',
          type: 'circle',
          source: 'dr_pysakki',
          'source-layer': 'dr_pysakki',
          paint: {
            'circle-color': 'white',
            'circle-stroke-color': colors.stop,
            'circle-stroke-width': 2,
          },
        }}
      />
    </Source>
  );
};
