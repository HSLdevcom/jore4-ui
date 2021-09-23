import composeRefs from '@seznam/compose-react-refs';
import debounce from 'lodash/debounce';
import React, {
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { MapContext } from 'react-map-gl';
import { DrawLineStringMode, EditingMode, Editor } from 'react-map-gl-draw';
import { getRoute } from '../../api/routing';
import { addRoute, removeRoute } from './mapUtils';

interface Props {
  mode?: Mode;
}

export enum Mode {
  Draw,
  Edit,
}

const modes = [
  { type: Mode.Draw, handler: DrawLineStringMode },
  { type: Mode.Edit, handler: EditingMode },
];

interface EditorCallback {
  data: ExplicitAny[];
  editType: 'addTentativePosition' | 'addFeature' | 'movePosition'; // NOTE: there are no guarantees that this list is complete :)
  editContext: ExplicitAny;
  selectedFeatureIndex: number;
}

// `react-map-gl-draw` library can't be updated into latest version
// until following issue is resolved. Otherwise editing won't work.
// https://github.com/uber/nebula.gl/issues/580
// Latest version of `react-map-gl-draw` doesn't seem to have peer dependencies,
// but v0.21.1 seems to require to have `@turf/area` dependency installed.

const DrawRouteLayerComponent = (
  { mode }: Props,
  externalRef: ExplicitAny,
): JSX.Element => {
  const { map } = useContext(MapContext);
  const editorRef = useRef<ExplicitAny>(null);

  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<
    number | null
  >(null);
  const [hasRoute, setHasRoute] = useState(false);

  useImperativeHandle(externalRef, () => ({
    onDeleteSelectedRoute: () => {
      editorRef.current.deleteFeatures(selectedFeatureIndex);
      const routeId = String(selectedFeatureIndex);
      removeRoute(map, routeId);
      setSelectedFeatureIndex(null);
      setHasRoute(false);
    },
  }));

  const createModeHandler = () => {
    if (hasRoute && mode === Mode.Draw) {
      // allow user to draw only one draft route at once.
      return undefined;
    }
    const modeDetails = modes.find((item) => item.type === mode);
    // eslint-disable-next-line new-cap
    return modeDetails ? new modeDetails.handler() : undefined;
  };

  const modeHandler = createModeHandler();

  const onAddRoute = async (e: EditorCallback) => {
    const addedFeatureIndex = e.data.length - 1;
    const routeId = String(addedFeatureIndex);
    const { coordinates } = e.data[addedFeatureIndex].geometry;
    const res = await getRoute(coordinates);
    setHasRoute(true);
    addRoute(map, routeId, res.routes[0].geometry);
  };

  const onSelect = (e: EditorCallback) => {
    if (e.selectedFeatureIndex >= 0) {
      setSelectedFeatureIndex(e.selectedFeatureIndex);
    }
  };

  const onUpdate = (e: EditorCallback) => {
    if (e.editType === 'addFeature') {
      // user added new route
      onAddRoute(e);
    }
    if (e.editType === 'movePosition' && selectedFeatureIndex !== undefined) {
      // user edited existing route
      onAddRoute(e);
    }
  };

  const getCursor = () => {
    switch (mode) {
      case Mode.Draw:
        return hasRoute ? 'not-allowed' : 'crosshair';
      case Mode.Edit:
        return 'grab';
      default:
        return undefined;
    }
  };

  return (
    <Editor
      style={{
        // This component doesn't support className prop so we have to
        // write styles manually
        cursor: getCursor(),
      }}
      ref={composeRefs(externalRef, editorRef)}
      clickRadius={12}
      mode={modeHandler}
      // Editor calls onUpdate callback million times when route is being edited. That's why we want to debounce the event.
      onUpdate={debounce(onUpdate, 500)}
      onSelect={onSelect}
    />
  );
};

export const DrawRouteLayer = React.forwardRef<ExplicitAny, Props>(
  DrawRouteLayerComponent,
);
