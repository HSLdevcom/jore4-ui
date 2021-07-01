import L from 'leaflet';
import 'leaflet.vectorgrid';
import React, { useMemo, useState } from 'react';
import { useMap } from 'react-leaflet';
import { SimpleButton } from '../../uiComponents';
import { Controls, Position } from './Controls';

interface Props {
  position?: Position;
}

export const Filters = ({ position }: Props): JSX.Element => {
  const map = useMap();
  const [showRoutes, setShowRoutes] = useState(true);
  const [showStops, setShowStops] = useState(true);

  const vectorGridRoutes = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(
        'http://localhost:3100/digiroad.dr_linkki_k/{z}/{x}/{y}.pbf',
        {
          vectorTileLayerStyles: {
            'digiroad.dr_linkki_k': {
              color: 'blue',
              fill: true,
              weight: 2,
            },
          },
        },
      ),
    [],
  );

  const vectorGridStops = useMemo(
    () =>
      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid.protobuf(
        'http://localhost:3100/digiroad.dr_pysakki/{z}/{x}/{y}.pbf',
        {
          vectorTileLayerStyles: {
            'digiroad.dr_pysakki': {
              color: 'red',
              fill: false,
              radius: 1,
            },
          },
        },
      ),
    [],
  );

  const onToggleRoutes = () => {
    setShowRoutes(!showRoutes);
    showRoutes
      ? map.addLayer(vectorGridRoutes)
      : map.removeLayer(vectorGridRoutes);
  };

  const onToggleStops = () => {
    setShowStops(!showStops);
    showStops
      ? map.addLayer(vectorGridStops)
      : map.removeLayer(vectorGridStops);
  };

  return (
    <Controls position={position}>
      <SimpleButton onClick={onToggleRoutes}>Toggle routes</SimpleButton>
      <SimpleButton onClick={onToggleStops}>Toggle stops</SimpleButton>
    </Controls>
  );
};
