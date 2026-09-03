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
  const { drawingMode, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);
  const { id: editedRouteId } = useAppSelector(selectEditedRouteData);
  const isEditingExistingRoute = drawingMode === Mode.Edit && !creatingNewRoute;

  if (!showRoute) {
    return null;
  }

  const renderedRouteIds = uniq([
    ...displayedRouteIds,
    ...(selectedRouteId ? [selectedRouteId] : []),
    ...(isEditingExistingRoute && editedRouteId ? [editedRouteId] : []),
  ]);

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
