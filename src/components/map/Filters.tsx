import L from 'leaflet';
import 'leaflet.vectorgrid';
import React, { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-leaflet';
import { theme } from '../../generated/theme';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { Controls, Position } from './Controls';
import { ExampleRoute } from './ExampleRoute';

const { colors } = theme;

interface Props {
  position?: Position;
}

const drLinksUrl =
  'http://localhost:3200/services/dr_linkki/tiles/{z}/{x}/{y}.pbf';
const drDynamicInfraLinksUrl =
  'http://localhost:3100/digiroad.dr_linkki_k/{z}/{x}/{y}.pbf';
const drStopsUrl = 'http://localhost:3100/digiroad.dr_pysakki/{z}/{x}/{y}.pbf';

export const Filters = ({ position }: Props): JSX.Element => {
  const map = useMap();
  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(true);
  const [showInfraLinks, setShowInfraLinks] = useState(true);
  const [showExampleRoute, setShowExampleRoute] = useState(true);
  const [showStops, setShowStops] = useState(true);

  const dynamicLinksLayer = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(drDynamicInfraLinksUrl, {
        vectorTileLayerStyles: {
          'digiroad.dr_linkki_k': {
            color: colors.tweakedBrand,
            fill: false,
            opacity: 0.6,
            weight: 5,
          },
        },
      }),
    [],
  );

  const infraLinksLayer = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(drLinksUrl, {
        vectorTileLayerStyles: {
          'digiroad.dr_linkki_k': {},
        },
      }),
    [],
  );

  const stopsLayer = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(drStopsUrl, {
        vectorTileLayerStyles: {
          'digiroad.dr_pysakki': {
            color: colors.stop,
            fill: true,
            fillColor: 'white',
            fillOpacity: 1,
            radius: 5,
          },
        },
      }),
    [],
  );

  useEffect(() => {
    showDynamicInfraLinks
      ? map.addLayer(dynamicLinksLayer)
      : map.removeLayer(dynamicLinksLayer);
  }, [showDynamicInfraLinks, map, dynamicLinksLayer]);

  useEffect(() => {
    showInfraLinks
      ? map.addLayer(infraLinksLayer)
      : map.removeLayer(infraLinksLayer);
  }, [showInfraLinks, map, infraLinksLayer]);

  useEffect(() => {
    showStops ? map.addLayer(stopsLayer) : map.removeLayer(stopsLayer);
  }, [showStops, map, stopsLayer]);

  return (
    <Controls position={position}>
      <FilterPanel
        routes={[
          {
            iconClassName: 'icon-bus',
            enabled: showDynamicInfraLinks,
            onToggle: setShowDynamicInfraLinks,
          },
          {
            iconClassName: 'icon-route',
            enabled: showInfraLinks,
            onToggle: setShowInfraLinks,
          },
          {
            iconClassName: 'icon-route',
            enabled: showExampleRoute,
            onToggle: setShowExampleRoute,
          },
        ]}
        stops={[
          {
            iconClassName: 'icon-bus',
            enabled: showStops,
            onToggle: setShowStops,
          },
        ]}
      />
      {showExampleRoute && <ExampleRoute />}
    </Controls>
  );
};
