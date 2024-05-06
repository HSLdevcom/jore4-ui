import MapboxDraw from '@mapbox/mapbox-gl-draw';
import noop from 'lodash/noop';
import { Ref, forwardRef, useImperativeHandle } from 'react';
import type { ControlPosition } from 'react-map-gl';
import { useControl } from 'react-map-gl/maplibre';
import { styles } from './routes/editorStyles';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate: (evt: { features: object[] }) => void;
  onUpdate: (evt: { features: object[]; action: string }) => void;
  onModeChange: () => void;
};

const DrawControlComponent = (
  props: DrawControlProps,
  ref: Ref<MapboxDraw> | undefined,
) => {
  const { onCreate, onModeChange, onUpdate, position } = props;
  const drawRef = useControl<MapboxDraw>(
    () => new MapboxDraw({ styles, ...props }),
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
