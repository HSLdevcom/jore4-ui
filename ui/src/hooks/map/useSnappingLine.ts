import debounce from 'lodash/debounce';
import { useCallback, useMemo, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { LineStringFeature, useAppDispatch } from '..';
import { resetDraftRouteGeometryAction } from '../../redux';
import { removeRoute } from '../../utils/map';
import { useRouteGeometryUpdater } from './useRouteGeometryUpdater';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

export const useSnappingLine = (map: MapRef | undefined) => {
  const dispatch = useAppDispatch();
  const [snappingLine, setSnappingLine] = useState<LineStringFeature | null>(
    null,
  );

  const addSnappingLine = (line: LineStringFeature) => {
    setSnappingLine(line);
  };

  const removeSnappingLine = useCallback(() => {
    setSnappingLine(null);
    if (map) {
      removeRoute(map.getMap(), SNAPPING_LINE_LAYER_ID);
      dispatch(resetDraftRouteGeometryAction());
    }
  }, [dispatch, map]);

  const onUpdateRouteGeometry = useRouteGeometryUpdater(
    map,
    removeSnappingLine,
  );

  const debouncedOnAddRoute = useMemo(
    () => debounce(onUpdateRouteGeometry, 500),
    [onUpdateRouteGeometry],
  );

  return {
    snappingLine,
    setSnappingLine: addSnappingLine,
    removeSnappingLine,
    debouncedOnAddRoute,
  };
};
