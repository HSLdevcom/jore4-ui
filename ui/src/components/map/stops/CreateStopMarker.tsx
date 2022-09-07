import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { theme } from '../../../generated/theme';
import { resetEnabledModesAction } from '../../../redux';
import { Circle } from '../markers';

const { colors } = theme;

type Coords = { x: number; y: number };

export const CreateStopMarker = (): JSX.Element => {
  const [mouseCoords, setMouseCoords] = React.useState<Coords>();
  const dispatch = useDispatch();

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

  const detectKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      dispatch(resetEnabledModesAction());
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true);
    return () => document.removeEventListener('keydown', detectKeyDown, true);
  });

  return (
    <div
      id="create-stop-marker"
      className="h-full w-full"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Display hovering bus stop while in create mode */}
      {mouseCoords && (
        <div
          style={{
            position: 'absolute',
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
