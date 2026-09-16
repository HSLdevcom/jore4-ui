import { FC } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import { ReusableComponentsVehicleSubmodeEnum } from '../../generated/graphql';
import { theme } from '../../generated/theme';
import { getInfraLinksMVTUrl } from './ApolloProtocol';

const { colors } = theme;

const BUS_INFRA_TILES_URL = getInfraLinksMVTUrl(
  ReusableComponentsVehicleSubmodeEnum.GenericBus,
);

const TRAM_INFRA_TILES_URL = getInfraLinksMVTUrl(
  ReusableComponentsVehicleSubmodeEnum.GenericTram,
);

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
      <Source id="dr_linkki_bus" type="vector" tiles={[BUS_INFRA_TILES_URL]}>
        <Layer
          {...{
            id: 'digiroad_r_links_bus',
            type: 'line',
            source: 'dr_linkki_bus',
            'source-layer': 'links',
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
      <Source id="mml_linkki_tram" type="vector" tiles={[TRAM_INFRA_TILES_URL]}>
        <Layer
          {...{
            id: 'mml_links_tram',
            type: 'line',
            source: 'tram_links',
            'source-layer': 'links',
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
