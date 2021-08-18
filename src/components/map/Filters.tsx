import L from 'leaflet';
import 'leaflet.vectorgrid';
import React, { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-leaflet';
import { theme } from '../../generated/theme';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { Controls, Position } from './Controls';

const { colors } = theme;

interface Props {
  position?: Position;
}

const mbtilesUrl =
  'http://localhost:3200/services/dr_linkki/tiles/{z}/{x}/{y}.pbf';
const drRoutesUrl =
  'http://localhost:3100/digiroad.dr_linkki_k/{z}/{x}/{y}.pbf';
const drStopsUrl = 'http://localhost:3100/digiroad.dr_pysakki/{z}/{x}/{y}.pbf';

export const Filters = ({ position }: Props): JSX.Element => {
  const map = useMap();
  const [showRoutes, setShowRoutes] = useState(true);
  const [showPreRenderedRoutes, setShowPreRenderedRoutes] = useState(true);
  const [showStops, setShowStops] = useState(true);

  const vectorGridRoutes = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(drRoutesUrl, {
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

  const preRenderedRoutes = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(mbtilesUrl, {
        vectorTileLayerStyles: {
          'digiroad.dr_linkki_k': {},
        },
      }),
    [],
  );

  const vectorGridStops = useMemo(
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
    showRoutes
      ? map.addLayer(vectorGridRoutes)
      : map.removeLayer(vectorGridRoutes);
  }, [showRoutes, map, vectorGridRoutes]);

  useEffect(() => {
    showPreRenderedRoutes
      ? map.addLayer(preRenderedRoutes)
      : map.removeLayer(preRenderedRoutes);
  }, [showPreRenderedRoutes, map, preRenderedRoutes]);

  useEffect(() => {
    showStops
      ? map.addLayer(vectorGridStops)
      : map.removeLayer(vectorGridStops);
  }, [showStops, map, vectorGridStops]);

  return (
    <Controls position={position}>
      <FilterPanel
        routes={[
          {
            iconClassName: 'icon-bus',
            enabled: showRoutes,
            onToggle: setShowRoutes,
          },
          {
            iconClassName: 'icon-route',
            enabled: showPreRenderedRoutes,
            onToggle: setShowPreRenderedRoutes,
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
    </Controls>
  );
};
