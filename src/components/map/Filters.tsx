import L from 'leaflet';
import 'leaflet.vectorgrid';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-leaflet';
import { Card, IconToggle } from '../../uiComponents';
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

  const { t } = useTranslation();

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

  const headingClassName = 'text-base font-bold';
  return (
    <Controls position={position}>
      <Card className="rounded-b-none">
        <h3 className={headingClassName}>{t('map.showRoutes')}</h3>
        <IconToggle
          iconClassName="icon-bus"
          enabled={showRoutes}
          onToggle={onToggleRoutes}
        />
      </Card>
      <Card className="!border-t-0 rounded-t-none">
        <h3 className={headingClassName}>{t('map.showStops')}</h3>
        <IconToggle
          iconClassName="icon-bus"
          enabled={showStops}
          onToggle={onToggleStops}
        />
      </Card>
    </Controls>
  );
};
