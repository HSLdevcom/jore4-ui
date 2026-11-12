import uniq from 'lodash/uniq';
import { FC } from 'react';
import {
  Mode,
  selectEditedRouteData,
  selectHasDraftRouteGeometry,
  selectIsRedrawingExistingRoute,
  selectMapRouteEditor,
  selectSelectedRouteId,
  selectVisibleRouteIds,
  useAppSelector,
} from '../../../../redux';
import { mapVehicleModeToRouteColor } from '../../../../utils/colors';
import { RouteGeometryLayer } from './RouteGeometryLayer';
import { useGetRouteRenderInfos } from './useGetRouteRenderInfos';

type ExistingRouteGeometryLayersProps = {
  readonly showRoute: boolean;
};

export const ExistingRouteGeometryLayers: FC<
  ExistingRouteGeometryLayersProps
> = ({ showRoute }) => {
  const selectedRouteId = useAppSelector(selectSelectedRouteId);
  const visibleRouteIds = useAppSelector(selectVisibleRouteIds);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const { drawingMode, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);
  const isRedrawingExistingRoute = useAppSelector(
    selectIsRedrawingExistingRoute,
  );
  const { id: editedRouteId } = useAppSelector(selectEditedRouteData);
  const isEditingExistingRoute = drawingMode === Mode.Edit && !creatingNewRoute;

  const renderedRouteIds = uniq([
    ...(showRoute ? visibleRouteIds : []),
    ...(isEditingExistingRoute && editedRouteId ? [editedRouteId] : []),
  ]).filter(
    (routeId) => !(isRedrawingExistingRoute && editedRouteId === routeId),
  );

  const renderInfos = useGetRouteRenderInfos(renderedRouteIds);

  return renderInfos.map((renderInfo) => {
    const routeId = renderInfo.route_id;

    if (!renderInfo.route_shape) {
      return null;
    }

    return (
      <RouteGeometryLayer
        key={routeId}
        routeId={routeId}
        geometry={renderInfo.route_shape}
        defaultColor={mapVehicleModeToRouteColor(
          renderInfo.route_line.primary_vehicle_mode,
          renderInfo.route_line.type_of_line,
        )}
        isHighlighted={
          (isEditingExistingRoute && editedRouteId === routeId) ||
          (!isEditingExistingRoute &&
            selectedRouteId === routeId &&
            !hasDraftRouteGeometry)
        }
      />
    );
  });
};
