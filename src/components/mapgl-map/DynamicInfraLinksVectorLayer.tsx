import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { theme } from '../../generated/theme';

const { colors } = theme;

export const DynamicInfraLinksVectorLayer: React.FC = () => {
  return (
    <Source
      type="vector"
      tiles={['http://localhost:3100/digiroad.dr_linkki/{z}/{x}/{y}.pbf']}
    >
      <Layer
        {...{
          id: 'digiroad.dr_linkki',
          type: 'line',
          source: 'dr_linkki',
          'source-layer': 'digiroad.dr_linkki',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': colors.tweakedBrand,
            'line-width': 5,
            'line-opacity': 0.6,
          },
        }}
      />
    </Source>
  );
};
