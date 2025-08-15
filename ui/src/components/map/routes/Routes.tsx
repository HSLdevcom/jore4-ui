import { ForwardRefRenderFunction, forwardRef, useRef } from 'react';
import { Layer } from 'react-map-gl/maplibre';
import { useAppSelector } from '../../../hooks';
import { Visible } from '../../../layoutComponents';
import {
  selectHasDraftRouteGeometry,
  selectMapRouteEditor,
  selectSelectedRouteId,
} from '../../../redux';
import { EditorLayerRef, RouteEditorRef } from '../refTypes';
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
  const editorLayerRef = useRef<EditorLayerRef | null>(null);

  const selectedRouteId = useAppSelector(selectSelectedRouteId);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const { drawingMode } = useAppSelector(selectMapRouteEditor);

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
        displayedRouteIds.map((item) => (
          <ExistingRouteGeometryLayer
            key={item}
            routeId={item}
            isSelected={selectedRouteId === item && !hasDraftRouteGeometry}
          />
        ))}
      <DraftRouteGeometryLayer />
      <RouteEditor
        onDeleteDrawnRoute={() => editorLayerRef.current?.onDelete()}
        ref={ref}
      />
      <Visible visible={drawingMode !== undefined}>
        <DrawRouteLayer editorLayerRef={editorLayerRef} />
      </Visible>
    </>
  );
};
export const Routes = forwardRef(RoutesImpl);
