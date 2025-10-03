// based on https://github.com/visgl/react-map-gl/blob/7.0-release/examples/custom-overlay/src/custom-overlay.tsx

import noop from 'lodash/noop';
import {
  FC,
  ReactElement,
  cloneElement,
  memo,
  useEffect,
  useId,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import type {
  ControlPosition,
  IControl,
  MapInstance,
} from 'react-map-gl/maplibre';
import { useControl } from 'react-map-gl/maplibre';
import { twMerge } from 'tailwind-merge';

const baseContainerClassNames =
  'pointer-events-none translate-x-0 translate-y-0';

// Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
class OverlayControl implements IControl {
  private map: MapInstance | null = null;

  private container: HTMLElement | undefined;

  private readonly redraw: () => void;

  private readonly position: ControlPosition;

  private readonly order: number;

  private readonly id: string;

  private className: string;

  constructor(
    redraw: () => void,
    position: ControlPosition,
    order: number,
    className: string | undefined,
    id: string,
  ) {
    this.redraw = redraw;
    this.position = position;
    this.order = order;
    this.className = className ?? '';
    this.id = id;
  }

  onAdd(map: MapInstance) {
    this.map = map;
    map.on('move', this.redraw);

    /* global document */
    this.container = document.createElement('div');
    this.container.id = this.id;
    this.container.className = twMerge(baseContainerClassNames, this.className);
    this.container.dataset.order = String(this.order);

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

  getOrder() {
    return this.order;
  }

  getClassName() {
    return this.className;
  }

  setClassName(className: string | undefined) {
    this.className = className ?? '';

    if (this.container) {
      this.container.className = twMerge(
        baseContainerClassNames,
        this.className,
      );
    }
  }
}

function reorderControls(map: MapInstance, id: string) {
  // eslint-disable-next-line no-underscore-dangle
  const addedControl = map._controlContainer.querySelector(
    `#${CSS.escape(id)}`,
  );
  const parentElement = addedControl?.parentElement;
  if (
    !(addedControl instanceof HTMLElement) ||
    !(parentElement instanceof HTMLElement)
  ) {
    return;
  }

  const order = Number(addedControl.dataset.order ?? '1');

  while (addedControl !== parentElement.firstChild) {
    const { previousSibling } = addedControl;

    if (!(previousSibling instanceof HTMLElement)) {
      return;
    }

    const previousSiblingOrder = Number(previousSibling.dataset.order ?? '1');

    console.log({
      addedControl,
      previousSibling,
      parentElement,
      order,
      previousSiblingOrder,
    });

    if (order < previousSiblingOrder) {
      parentElement.insertBefore(addedControl, previousSibling);
    } else {
      return;
    }
  }
}

type CustomOverlayComponentProps = {
  readonly children: ReactElement;
  readonly className?: string;
  readonly order?: number;
  readonly position: ControlPosition;
};

/**
 * A custom control that rerenders arbitrary React content whenever the camera changes
 */
const CustomOverlayComponent: FC<CustomOverlayComponentProps> = ({
  children,
  className,
  order = 1,
  position,
}) => {
  const [, setVersion] = useState(0);
  const id = useId();

  const ctrl = useControl<OverlayControl>(
    () => {
      const forceUpdate = () => setVersion((v) => v + 1);
      return new OverlayControl(forceUpdate, position, order, className, id);
    },
    (context) => reorderControls(context.map.getMap(), id),
    noop,
  );

  useEffect(() => {
    ctrl.setClassName(className);
  }, [className, ctrl]);

  const ctrlElement = ctrl.getElement();
  const map = ctrl.getMap();

  // Prevent assigning "map" as a prop/attr on raw HTML elements
  const newChildProps = typeof children.type === 'string' ? {} : { map };

  return map && ctrlElement
    ? createPortal(cloneElement(children, newChildProps), ctrlElement)
    : null;
};

export const CustomOverlay = memo(CustomOverlayComponent);
