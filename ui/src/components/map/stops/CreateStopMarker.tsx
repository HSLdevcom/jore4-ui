import React from 'react';
import { theme } from '../../../generated/theme';
import { Circle } from '../markers';

const { colors } = theme;

type Coords = { x: number; y: number };

export const CreateStopMarker = (): JSX.Element => {
  const [mouseCoords, setMouseCoords] = React.useState<Coords>();

  const createStopMarkerSize = 20;

  // gets the mouse coordinates relative to the container's top left corner
  const onMouseMove = (e: React.MouseEvent) => {
    const containerBoundingBox = document
      .querySelector('#create-stop-marker')
      ?.getBoundingClientRect();
    const x = e.clientX - (containerBoundingBox?.left || 0);
    const y = e.clientY - (containerBoundingBox?.top || 0);

    setMouseCoords({ x, y });
  };

  const onMouseLeave = () => {
    // hide marker if the mouse leaves from the map area
    setMouseCoords(undefined);
  };
  const onClick = (event: MouseEvent) => {
    const syntheticClickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: event.pageX,
      clientY: event.pageY,
    });
    const mapElement = document
      .getElementsByClassName('maplibregl-canvas')
      .item(0);

    if (mapElement) {
      mapElement.dispatchEvent(syntheticClickEvent);
    } else {
      console.log('TODO: meaningful error message');
      // TODO: fix zooming while adding stop
    }
  };

  return (
    <div
      id="create-stop-marker"
      className="absolute h-full w-full"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseMove}
      onMouseLeave={onMouseLeave}
      // onScrollCapture={(event) => console.log(event)}
      onClick={onClick}
    >
      {/* Display hovering bus stop while in create mode */}
      {mouseCoords && (
        <div
          className="absolute"
          style={{
            // position: 'absolute',
            left: mouseCoords.x - createStopMarkerSize / 2,
            top: mouseCoords.y - createStopMarkerSize / 2,
          }}
        >
          <Circle
            centerDot
            borderColor={colors.hslRed}
            size={createStopMarkerSize}
          />
        </div>
      )}
    </div>
  );
};
