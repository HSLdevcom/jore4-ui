import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { theme } from '../../generated/theme';

const { colors } = theme;

export const InfraLinksVectorLayer: React.FC = () => {
  return (
    <Source
      type="vector"
      tiles={['/api/mbtiles/services/dr_linkki/tiles/{z}/{x}/{y}.pbf']}
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
            'line-color': colors.tweakedBrand,
            'line-width': 5,
            'line-opacity': 0.6,
          },
        }}
      />
    </Source>
  );
};
