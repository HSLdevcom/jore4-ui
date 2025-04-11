import MapboxDraw from '@mapbox/mapbox-gl-draw';
import noop from 'lodash/noop';
import type { Map as MapBoxMap } from 'mapbox-gl';
import { Ref, forwardRef, useImperativeHandle } from 'react';
import { ControlPosition, IControl, useControl } from 'react-map-gl/maplibre';
import { styles } from './routes/editorStyles';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate: (evt: { features: object[] }) => void;
  onUpdate: (evt: { features: object[] }) => void;
  onModeChange: () => void;
};

type MapLibreMap = Parameters<IControl['onAdd']>[0];

declare class MapLibreMapboxDraw extends MapboxDraw implements IControl {
  onAdd(map: MapBoxMap | MapLibreMap): HTMLElement;

  onRemove(map: MapBoxMap | MapLibreMap): ExplicitAny;

  getDefaultPosition: () => ControlPosition;
}

const DrawControlComponent = (
  props: DrawControlProps,
  ref: Ref<MapboxDraw> | undefined,
) => {
  const { onCreate, onModeChange, onUpdate, position } = props;
  const drawRef = useControl<MapLibreMapboxDraw>(
    () => new MapboxDraw({ styles, ...props }) as MapLibreMapboxDraw,
    ({ map }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.modechange', onModeChange);
    },
    noop,
    {
      position,
    },
  );
  useImperativeHandle(ref, () => drawRef, [drawRef]);

  return null;
};

export const DrawControl = forwardRef(DrawControlComponent);
