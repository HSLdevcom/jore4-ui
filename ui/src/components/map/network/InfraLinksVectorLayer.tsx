import { FC } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';

const { colors } = theme;

const BUS_NETWORK_TILES_URL =
  '/api/mbtiles/services/dr_linkki/tiles/{z}/{x}/{y}.pbf';

const TRAM_NETWORK_TILES_URL =
  '/api/mbtiles/services/tram_links/tiles/{z}/{x}/{y}.pbf';

type InfraLinksVectorLayerProps = {
  readonly enableInfraLinkLayer: boolean;
  readonly showBusNetwork: boolean;
  readonly showTramNetwork: boolean;
};

export const InfraLinksVectorLayer: FC<InfraLinksVectorLayerProps> = ({
  enableInfraLinkLayer,
  showBusNetwork,
  showTramNetwork,
}) => {
  if (!enableInfraLinkLayer) {
    return null;
  }

  return (
    <>
      {/* Bus network infrastructure links. */}
      <Source id="dr_linkki_bus" type="vector" tiles={[BUS_NETWORK_TILES_URL]}>
        <Layer
          {...{
            id: 'digiroad_r_links_bus',
            type: 'line',
            source: 'dr_linkki_bus',
            'source-layer': 'dr_linkki',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': colors.tweakedBrand,
              'line-width': 5,
              'line-opacity': showBusNetwork ? 0.6 : 0,
            },
          }}
        />
      </Source>

      {/* Tram network infrastructure links. */}
      <Source
        id="dr_linkki_tram"
        type="vector"
        tiles={[TRAM_NETWORK_TILES_URL]}
      >
        <Layer
          {...{
            id: 'digiroad_r_links_tram',
            type: 'line',
            source: 'tram_links',
            'source-layer': 'tram_links',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': colors.hslTramDarkGreen,
              'line-width': 5,
              'line-opacity': showTramNetwork ? 0.5 : 0,
            },
          }}
        />
      </Source>
    </>
  );
};
