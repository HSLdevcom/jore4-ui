import { removeLayer, MaplibreGLMap, Geometry } from '../mapUtils';

const INFRA_CONNECTION_NAME = 'infraConnection';

export const removeStopToInfraConnection = (map: MaplibreGLMap) => {
  removeLayer(map, INFRA_CONNECTION_NAME);
};

export const addStopToInfraConnection = (
  map: MaplibreGLMap,
  geometry: Geometry,
) => {
  const source = map.getSource(INFRA_CONNECTION_NAME);
  if (!source) {
    map.addSource(INFRA_CONNECTION_NAME, {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry },
    });
  } else {
    source.setData({
      type: 'Feature',
      properties: {},
      geometry,
    });
  }

  if (!map.getLayer(INFRA_CONNECTION_NAME)) {
    map.addLayer({
      id: INFRA_CONNECTION_NAME,
      type: 'line',
      source: INFRA_CONNECTION_NAME,
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'darkGrey',
        'line-width': 4,
        'line-opacity': 1,
        'line-offset': 0,
        'line-dasharray': [1, 1.5],
      },
    });
  }
};
