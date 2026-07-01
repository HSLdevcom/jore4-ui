import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Map as MapBoxMap } from 'mapbox-gl';
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { ControlPosition, IControl, useControl } from 'react-map-gl/maplibre';
import { styles } from './routes/editorStyles';
import { joreDrawModes } from './utils/drawModeUtils';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  readonly position?: ControlPosition;
  readonly onCreate: (evt: { features: ReadonlyArray<object> }) => void;
  readonly onUpdate: (evt: { features: ReadonlyArray<object> }) => void;
  readonly onModeChange: () => void;
};

type MapLibreMap = Parameters<IControl['onAdd']>[0];

declare class MapLibreMapboxDraw extends MapboxDraw implements IControl {
  onAdd(map: MapBoxMap | MapLibreMap): HTMLElement;

  onRemove(map: MapBoxMap | MapLibreMap): ExplicitAny;

  getDefaultPosition: () => ControlPosition;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useMutableFunction<T extends Function>(fn: T): T {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useMemo<T>(
    () => ((...args: unknown[]) => fnRef.current(...args)) as unknown as T,
    [],
  );
}

const DrawControlComponent: ForwardRefRenderFunction<
  MapboxDraw,
  DrawControlProps
> = ({ onCreate, onModeChange, onUpdate, position, ...drawOptions }, ref) => {
  const internalOnCreate = useMutableFunction(onCreate);
  const internalOnUpdate = useMutableFunction(onUpdate);
  const internalOnModeChange = useMutableFunction(onModeChange);

  const drawRef = useControl<MapLibreMapboxDraw>(
    () =>
      new MapboxDraw({
        styles,
        ...drawOptions,
        modes: joreDrawModes,
      }) as MapLibreMapboxDraw,
    ({ map }) => {
      map.on('draw.create', internalOnCreate);
      map.on('draw.update', internalOnUpdate);
      map.on('draw.modechange', internalOnModeChange);
    },
    ({ map }) => {
      map.off('draw.create', internalOnCreate);
      map.off('draw.update', internalOnUpdate);
      map.off('draw.modechange', internalOnModeChange);
    },
    { position },
  );
  useImperativeHandle(ref, () => drawRef, [drawRef]);

  return null;
};

export const DrawControl = forwardRef(DrawControlComponent);
