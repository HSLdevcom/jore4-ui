import { FC } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';

const { colors } = theme;

type InfraLinksVectorLayerProps = {
  readonly enableInfraLinkLayer: boolean;
  readonly showInfraLinks: boolean;
};

export const InfraLinksVectorLayer: FC<InfraLinksVectorLayerProps> = ({
  enableInfraLinkLayer,
  showInfraLinks,
}) => {
  if (!enableInfraLinkLayer) {
    return null;
  }

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
            'line-opacity': showInfraLinks ? 0.6 : 0,
          },
        }}
      />
    </Source>
  );
};
