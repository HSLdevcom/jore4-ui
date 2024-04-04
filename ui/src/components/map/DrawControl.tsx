import MapboxDraw from '@mapbox/mapbox-gl-draw';
import noop from 'lodash/noop';
import { Ref, forwardRef, useImperativeHandle } from 'react';
import type { ControlPosition } from 'react-map-gl';
import { useControl } from 'react-map-gl/maplibre';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate: (evt: { features: object[] }) => void;
  onUpdate: (evt: { features: object[]; action: string }) => void;
};

const DrawControlComponent = (
  props: DrawControlProps,
  ref: Ref<MapboxDraw> | undefined,
) => {
  const { onCreate, onUpdate, position } = props;
  const drawRef = useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
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
