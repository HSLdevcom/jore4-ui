import uniq from 'lodash/uniq';
import { FC } from 'react';
import {
  Mode,
  selectEditedRouteData,
  selectHasDraftRouteGeometry,
  selectMapRouteEditor,
  selectSelectedRouteId,
  useAppSelector,
} from '../../../../redux';
import { ExistingRouteGeometryLayer } from './ExistingRouteGeometryLayer';

type ExistingRouteGeometryLayersProps = {
  readonly displayedRouteIds: ReadonlyArray<string>;
  readonly showRoute: boolean;
};

export const ExistingRouteGeometryLayers: FC<
  ExistingRouteGeometryLayersProps
> = ({ displayedRouteIds, showRoute }) => {
  const selectedRouteId = useAppSelector(selectSelectedRouteId);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const { drawingMode, creatingNewRoute, suppressBaseRouteRehydrate } =
    useAppSelector(selectMapRouteEditor);
  const { id: editedRouteId } = useAppSelector(selectEditedRouteData);
  const isEditingExistingRoute = drawingMode === Mode.Edit && !creatingNewRoute;
  // Keep the currently edited route hidden while suppressed redraw is active,
  // even when redraw temporarily uses creation-like UI state.
  const hideEditedRouteDuringSuppressedRedraw = suppressBaseRouteRehydrate;

  if (!showRoute) {
    return null;
  }

  const renderedRouteIds = uniq([
    ...displayedRouteIds,
    ...(selectedRouteId ? [selectedRouteId] : []),
    ...(isEditingExistingRoute && editedRouteId ? [editedRouteId] : []),
  ]).filter(
    (routeId) =>
      !(hideEditedRouteDuringSuppressedRedraw && editedRouteId === routeId),
  );

  return renderedRouteIds.map((item) => (
    <ExistingRouteGeometryLayer
      key={item}
      routeId={item}
      isSelected={
        (isEditingExistingRoute && editedRouteId === item) ||
        (!isEditingExistingRoute &&
          selectedRouteId === item &&
          !hasDraftRouteGeometry)
      }
    />
  ));
};
