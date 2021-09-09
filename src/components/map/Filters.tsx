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
const drStopsUrl =
  'http://localhost:3200/services/dr_pysakki/tiles/{z}/{x}/{y}.pbf';
const drDynamicStopsUrl =
  'http://localhost:3100/digiroad.dr_pysakki/{z}/{x}/{y}.pbf';

export const Filters = ({ position }: Props): JSX.Element => {
  const map = useMap();
  const [showInfraLinks, setShowInfraLinks] = useState(true);
  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(false);
  const [showExampleRoute, setShowExampleRoute] = useState(false);
  const [showStops, setShowStops] = useState(true);
  const [showDynamicStops, setShowDynamicStops] = useState(false);

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

  const stopsLayer = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(drStopsUrl, {
        vectorTileLayerStyles: {
          dr_pysakki: {
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

  const dynamicStopsLayer = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(drDynamicStopsUrl, {
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
    showInfraLinks
      ? map.addLayer(infraLinksLayer)
      : map.removeLayer(infraLinksLayer);
  }, [showInfraLinks, map, infraLinksLayer]);

  useEffect(() => {
    showDynamicInfraLinks
      ? map.addLayer(dynamicLinksLayer)
      : map.removeLayer(dynamicLinksLayer);
  }, [showDynamicInfraLinks, map, dynamicLinksLayer]);

  useEffect(() => {
    showStops ? map.addLayer(stopsLayer) : map.removeLayer(stopsLayer);
  }, [showStops, map, stopsLayer]);

  useEffect(() => {
    showDynamicStops
      ? map.addLayer(dynamicStopsLayer)
      : map.removeLayer(dynamicStopsLayer);
  }, [showDynamicStops, map, dynamicStopsLayer]);

  return (
    <Controls position={position}>
      <FilterPanel
        routes={[
          {
            iconClassName: 'icon-bus',
            enabled: showInfraLinks,
            onToggle: setShowInfraLinks,
          },
          {
            iconClassName: 'icon-route',
            enabled: showDynamicInfraLinks,
            onToggle: setShowDynamicInfraLinks,
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
          {
            iconClassName: 'icon-bus',
            enabled: showDynamicStops,
            onToggle: setShowDynamicStops,
          },
        ]}
      />
      {showExampleRoute && <ExampleRoute />}
    </Controls>
  );
};
