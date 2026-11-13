import { FC, ForwardRefRenderFunction, forwardRef, useRef } from 'react';
import { Layer } from 'react-map-gl/maplibre';
import { selectMapRouteEditor, useAppSelector } from '../../../redux';
import { Visible } from '../../common/LayoutComponents';
import { RouteEditorRef } from '../refTypes';
import { DrawRouteLayer, DrawRouteLayerRef } from './DrawRoute';
import {
  DraftRouteGeometryLayer,
  ExistingRouteGeometryLayers,
} from './GeometryLayers';
import { LineRoutesOverlay } from './LineRoutesOverlay';
import { EditRouteMetadataLayer, RouteEditor } from './RouteEditor';
import { ROUTE_BASE_LAYER_ID } from './Utils';

/**
 * Empty layer for dynamically ordering route layers
 * https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
 */
const RouteBaseLayer: FC = () => (
  <Layer
    id={ROUTE_BASE_LAYER_ID}
    type="background"
    layout={{ visibility: 'none' }}
    paint={{}}
  />
);

type RoutesProps = {
  readonly showRoute: boolean;
};

const RoutesImpl: ForwardRefRenderFunction<RouteEditorRef, RoutesProps> = (
  { showRoute },
  ref,
) => {
  const { drawingMode } = useAppSelector(selectMapRouteEditor);
  const drawRouteLayerRef = useRef<DrawRouteLayerRef>(null);

  const onClearDrawnRouteGeometry = () => {
    drawRouteLayerRef.current?.clearDrawnRouteGeometry();
  };

  return (
    <>
      <EditRouteMetadataLayer />

      <LineRoutesOverlay className="pointer-events-auto mt-2 max-h-[60vh] overflow-hidden" />

      <RouteBaseLayer />
      <ExistingRouteGeometryLayers showRoute={showRoute} />
      <DraftRouteGeometryLayer />

      <RouteEditor
        ref={ref}
        onClearDrawnRouteGeometry={onClearDrawnRouteGeometry}
      />
      <Visible visible={drawingMode !== undefined}>
        <DrawRouteLayer ref={drawRouteLayerRef} />
      </Visible>
    </>
  );
};
export const Routes = forwardRef(RoutesImpl);
