// TODO: Can we import these somewhere?
export type MaplibreGLMap = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Geometry = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const removeRoute = (map: MaplibreGLMap, id: string) => {
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
  // when route is created with map.addLayer, corresponding
  // source seems to be also created and we have to remove
  // also it before we can create new route with same id
  if (map.getSource(id)) {
    map.removeSource(id);
  }
};

export const addRoute = (
  map: MaplibreGLMap,
  id: string,
  geometry: Geometry,
) => {
  // remove possible existing layers with same id
  removeRoute(map, id);
  map.addLayer({
    id,
    type: 'line',
    source: {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry,
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#03AA46',
      'line-width': 8,
      'line-opacity': 0.8,
      'line-offset': 6,
    },
  });
};
