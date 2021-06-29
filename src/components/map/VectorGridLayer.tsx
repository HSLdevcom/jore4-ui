import 'leaflet.vectorgrid';
import React from 'react';
import { useMap } from 'react-leaflet';

export const VectorGridLayer: React.FC = () => {
  const map = useMap();
  if (process.browser) {
    // Leaflet has to be imported dynamically and only in browsers - otherwise
    // next.js tries to import it on server and then we get "window is undefined"
    // errors.
    (async () => {
      const L = (await import('leaflet')).default;

      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid
        .protobuf(
          'http://localhost:3100/digiroad.dr_linkki_k/{z}/{x}/{y}.pbf',
          {
            vectorTileLayerStyles: {
              'digiroad.dr_linkki_k': {
                color: 'red',
                fill: true,
                weight: 2,
              },
            },
          },
        )
        .addTo(map);

      // @ts-expect-error Leaflet's TS typings won't recognize leaflet.vectorgrid plugin
      L.vectorGrid
        .protobuf('http://localhost:3100/digiroad.dr_pysakki/{z}/{x}/{y}.pbf', {
          vectorTileLayerStyles: {
            'digiroad.dr_pysakki': {
              color: 'blue',
              fill: false,
              radius: 1,
            },
          },
        })
        .addTo(map);
    })();
  }
  return null;
};
