import uniq from 'lodash/uniq';
import { ForwardRefRenderFunction, forwardRef, useRef } from 'react';
import { Layer } from 'react-map-gl/maplibre';
import { useAppSelector } from '../../../hooks';
import { Visible } from '../../../layoutComponents';
import {
  Mode,
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
  const { drawingMode, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);

  const renderedRouteIds = selectedRouteId
    ? uniq([...displayedRouteIds, selectedRouteId])
    : displayedRouteIds;

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
              selectedRouteId === item &&
              ((drawingMode === Mode.Edit && !creatingNewRoute) ||
                !hasDraftRouteGeometry)
            }
          />
        ))}
      <DraftRouteGeometryLayer />
      <RouteEditor
        onDeleteDrawnRoute={() => editorLayerRef.current?.onDelete()}
        onCancel={() => editorLayerRef.current?.onCancel()}
        onSave={() => Promise.resolve(editorLayerRef.current?.onSave() ?? true)}
        ref={ref}
      />
      <Visible visible={drawingMode !== undefined}>
        <DrawRouteLayer editorLayerRef={editorLayerRef} />
      </Visible>
    </>
  );
};
export const Routes = forwardRef(RoutesImpl);
