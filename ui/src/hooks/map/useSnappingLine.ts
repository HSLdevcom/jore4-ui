import debounce from 'lodash/debounce';
import { Map } from 'maplibre-gl';
import { useCallback, useMemo, useState } from 'react';
import { MapRef } from 'react-map-gl/dist/esm/mapbox/create-ref';
import { LineStringFeature, useAppDispatch } from '..';
import { resetDraftRouteGeometryAction } from '../../redux';
import { removeRoute } from '../../utils/map';
import { useRouteGeometryUpdater } from './useRouteGeometryUpdater';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

export const useSnappingLine = (map: MapRef<Map> | undefined) => {
  const dispatch = useAppDispatch();
  const [snappingLine, setSnappingLine] = useState<LineStringFeature>();

  const onDelete = useCallback(() => {
    setSnappingLine(undefined);
    if (map) {
      removeRoute(map.getMap(), SNAPPING_LINE_LAYER_ID);
      dispatch(resetDraftRouteGeometryAction());
    }
  }, [dispatch, map]);

  const onUpdateRouteGeometry = useRouteGeometryUpdater(map, onDelete);

  const debouncedOnAddRoute = useMemo(
    () => debounce(onUpdateRouteGeometry, 500),
    [onUpdateRouteGeometry],
  );

  return {
    snappingLine,
    setSnappingLine,
    onDelete,
    debouncedOnAddRoute,
  };
};
