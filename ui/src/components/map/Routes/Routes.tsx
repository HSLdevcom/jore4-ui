import { FC, ForwardRefRenderFunction, forwardRef } from 'react';
import { Layer } from 'react-map-gl/maplibre';
import { selectMapRouteEditor, useAppSelector } from '../../../redux';
import { Visible } from '../../common/LayoutComponents';
import { RouteEditorRef } from '../refTypes';
import { DrawRouteLayer } from './DrawRoute';
import {
  DraftRouteGeometryLayer,
  ExistingRouteGeometryLayers,
} from './GeometryLayers';
import { EditRouteMetadataLayer, RouteEditor } from './RouteEditor';
import { RouteStopsOverlay } from './RouteStopsOverlay';
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
  readonly displayedRouteIds: ReadonlyArray<string>;
  readonly showRoute: boolean;
};

const RoutesImpl: ForwardRefRenderFunction<RouteEditorRef, RoutesProps> = (
  { displayedRouteIds, showRoute },
  ref,
) => {
  const { drawingMode } = useAppSelector(selectMapRouteEditor);

  return (
    <>
      <EditRouteMetadataLayer />

      <RouteStopsOverlay className="pointer-events-auto mt-2 max-h-[60vh] overflow-hidden" />

      <RouteBaseLayer />
      <ExistingRouteGeometryLayers
        displayedRouteIds={displayedRouteIds}
        showRoute={showRoute}
      />
      <DraftRouteGeometryLayer />

      <RouteEditor ref={ref} />
      <Visible visible={drawingMode !== undefined}>
        <DrawRouteLayer />
      </Visible>
    </>
  );
};
export const Routes = forwardRef(RoutesImpl);
