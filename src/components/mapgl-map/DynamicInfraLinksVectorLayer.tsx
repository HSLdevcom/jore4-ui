import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { theme } from '../../generated/theme';

const { colors } = theme;

export const DynamicInfraLinksVectorLayer: React.FC = () => {
  return (
    <Source
      type="vector"
      tiles={['http://localhost:3100/digiroad.dr_linkki_k/{z}/{x}/{y}.pbf']}
    >
      <Layer
        {...{
          id: 'digiroad.dr_linkki_k',
          type: 'line',
          source: 'dr_linkki_k',
          'source-layer': 'digiroad.dr_linkki_k',
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
