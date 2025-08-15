// based on https://github.com/visgl/react-map-gl/blob/7.0-release/examples/custom-overlay/src/custom-overlay.tsx

import { FC, ReactElement, cloneElement, memo, useState } from 'react';
import { createPortal } from 'react-dom';
import type {
  ControlPosition,
  IControl,
  MapInstance,
} from 'react-map-gl/maplibre';
import { useControl } from 'react-map-gl/maplibre';

// Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
class OverlayControl implements IControl {
  private map: MapInstance | null = null;

  private container: HTMLElement | undefined;

  private redraw: () => void;

  private position: ControlPosition;

  constructor(redraw: () => void, position: ControlPosition) {
    this.redraw = redraw;
    this.position = position;
  }

  onAdd(map: MapInstance) {
    this.map = map;
    map.on('move', this.redraw);
    /* global document */
    this.container = document.createElement('div');
    this.container.className =
      'pointer-events-auto translate-x-0 translate-y-0';
    this.redraw();
    return this.container;
  }

  onRemove() {
    this.container?.remove();
    this.map?.off('move', this.redraw);
    this.map = null;
  }

  getDefaultPosition() {
    // TODO: not sure if there are better solutions for positioning
    // custom overlays than implementing this function. Anyway, seems like
    // without this custom overlays end up being outside the map and are really
    // difficult to move properly with css
    return this.position;
  }

  getMap() {
    return this.map;
  }

  getElement() {
    return this.container;
  }
}

type CustomOverlayComponentProps = {
  readonly position: ControlPosition;
  readonly children: ReactElement;
};

/**
 * A custom control that rerenders arbitrary React content whenever the camera changes
 */
const CustomOverlayComponent: FC<CustomOverlayComponentProps> = ({
  children,
  position,
}) => {
  const [, setVersion] = useState(0);

  const ctrl = useControl<OverlayControl>(() => {
    const forceUpdate = () => setVersion((v) => v + 1);
    return new OverlayControl(forceUpdate, position);
  });

  const ctrlElement = ctrl.getElement();
  const map = ctrl.getMap();

  // Prevent assigning "map" as a prop/attr on raw HTML elements
  const newChildProps = typeof children.type === 'string' ? {} : { map };

  return map && ctrlElement
    ? createPortal(cloneElement(children, newChildProps), ctrlElement)
    : null;
};

export const CustomOverlay = memo(CustomOverlayComponent);
