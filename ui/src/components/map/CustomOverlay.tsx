// based on https://github.com/visgl/react-map-gl/blob/7.0-release/examples/custom-overlay/src/custom-overlay.tsx
/* eslint-disable no-underscore-dangle */

import * as React from 'react';
import { cloneElement, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ControlPosition, IControl, MapInstance } from 'react-map-gl/maplibre';
import { useControl } from 'react-map-gl/maplibre';

// Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
class OverlayControl implements IControl {
  _map: MapInstance | null = null;

  _container: HTMLElement | undefined;

  _redraw: () => void;

  _position: ControlPosition;

  constructor(redraw: () => void, position: ControlPosition) {
    this._redraw = redraw;
    this._position = position;
  }

  onAdd(map: MapInstance) {
    this._map = map;
    map.on('move', this._redraw);
    /* global document */
    this._container = document.createElement('div');
    this._container.className =
      'pointer-events-auto translate-x-0 translate-y-0';
    this._redraw();
    return this._container;
  }

  onRemove() {
    this._container?.remove();
    this._map?.off('move', this._redraw);
    this._map = null;
  }

  getDefaultPosition() {
    // TODO: not sure if there are better solutions for positioning
    // custom overlays than implementing this function. Anyway, seems like
    // without this custom overlays end up being outside the map and are really
    // difficult to move properly with css
    return this._position;
  }

  getMap() {
    return this._map;
  }

  getElement() {
    return this._container;
  }
}

/**
 * A custom control that rerenders arbitrary React content whenever the camera changes
 */
const CustomOverlayComponent = ({
  children,
  position,
}: {
  children: React.ReactElement;
  position: ControlPosition;
}) => {
  const [, setVersion] = useState(0);

  const ctrl = useControl<OverlayControl>(() => {
    const forceUpdate = () => setVersion((v) => v + 1);
    return new OverlayControl(forceUpdate, position);
  });

  const ctrlElement = ctrl.getElement();
  const map = ctrl.getMap();

  return map && ctrlElement
    ? createPortal(cloneElement(children, { map }), ctrlElement)
    : null;
};

export const CustomOverlay = React.memo(CustomOverlayComponent);
