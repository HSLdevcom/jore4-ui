import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { theme } from '../../generated/theme';

const { colors } = theme;

export const DynamicStopVectorLayer: React.FC = () => {
  return (
    <Source
      type="vector"
      tiles={['http://localhost:3100/digiroad.dr_pysakki/{z}/{x}/{y}.pbf']}
    >
      <Layer
        {...{
          id: 'digiroad.dr_pysakki',
          type: 'circle',
          source: 'dr_pysakki',
          'source-layer': 'digiroad.dr_pysakki',
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
