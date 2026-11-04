import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import {
  resetDraftRouteGeometryAction,
  useAppDispatch,
} from '../../../../../redux';
import { SNAPPING_LINE_LAYER_ID, removeRoute } from '../../Utils';
import { LineStringFeature } from '../types';
import { useRouteGeometryUpdater } from './useRouteGeometryUpdater';

const ROUTE_GEOMETRY_UPDATE_DEBOUNCE_MS = 500;

export function useSnappingLine(
  map: MapRef | undefined,
  onDrawGeometryRejected?: () => void,
) {
  const dispatch = useAppDispatch();
  const [snappingLine, setSnappingLine] = useState<LineStringFeature | null>(
    null,
  );

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
    onDrawGeometryRejected,
  );

  // Keep latest updater function behind a ref while preserving one stable
  // debouncer instance. This avoids losing pending timer cancellation across
  // rerenders when callback identity changes.
  const routeGeometryUpdaterRef = useRef(onUpdateRouteGeometry);

  useEffect(() => {
    routeGeometryUpdaterRef.current = onUpdateRouteGeometry;
  }, [onUpdateRouteGeometry]);

  const debouncedOnAddRoute = useMemo(
    () =>
      debounce(
        (
          feature: LineStringFeature,
          startedInCreationFlowAtDrawTime?: boolean,
        ) => {
          routeGeometryUpdaterRef.current(
            feature,
            startedInCreationFlowAtDrawTime,
          );
        },
        ROUTE_GEOMETRY_UPDATE_DEBOUNCE_MS,
      ),
    [],
  );

  useEffect(() => {
    return () => {
      // Avoid late async geometry updates after layer teardown.
      debouncedOnAddRoute.cancel();
    };
  }, [debouncedOnAddRoute]);

  return {
    snappingLine,
    setSnappingLine,
    removeSnappingLine,
    debouncedOnAddRoute,
  };
}
