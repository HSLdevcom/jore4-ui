import uniq from 'lodash/uniq';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { Layer } from 'react-map-gl/maplibre';
import { useAppSelector } from '../../../hooks';
import {
  Mode,
  selectEditedRouteData,
  selectHasDraftRouteGeometry,
  selectMapRouteEditor,
  selectSelectedRouteId,
} from '../../../redux';
import { Visible } from '../../common/LayoutComponents';
import { RouteEditorRef } from '../refTypes';
import { DraftRouteGeometryLayer } from './DraftRouteGeometryLayer';
import { DrawRouteLayer } from './DrawRouteLayer';
import { EditRouteMetadataLayer } from './EditRouteMetadataLayer';
import { ExistingRouteGeometryLayer } from './ExistingRouteGeometryLayer';
import { RouteEditor } from './RouteEditor';

type RoutesProps = {
  readonly displayedRouteIds: ReadonlyArray<string>;
  readonly showRoute: boolean;
};

const RoutesImpl: ForwardRefRenderFunction<RouteEditorRef, RoutesProps> = (
  { displayedRouteIds, showRoute },
  ref,
) => {
  const selectedRouteId = useAppSelector(selectSelectedRouteId);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const { drawingMode, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);
  const { id: editedRouteId } = useAppSelector(selectEditedRouteData);
  const isEditingExistingRoute = drawingMode === Mode.Edit && !creatingNewRoute;

  const renderedRouteIds = uniq([
    ...displayedRouteIds,
    ...(selectedRouteId ? [selectedRouteId] : []),
    ...(isEditingExistingRoute && editedRouteId ? [editedRouteId] : []),
  ]);

  return (
    <>
      <EditRouteMetadataLayer />

      {/**
       * Empty layer for dynamically ordering route layers
       * https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
       */}
      <Layer
        id="route_base"
        type="background"
        layout={{ visibility: 'none' }}
        paint={{}}
      />
      {showRoute &&
        renderedRouteIds.map((item) => (
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
        ))}
      <DraftRouteGeometryLayer />
      <RouteEditor ref={ref} />
      <Visible visible={drawingMode !== undefined}>
        <DrawRouteLayer />
      </Visible>
    </>
  );
};
export const Routes = forwardRef(RoutesImpl);
