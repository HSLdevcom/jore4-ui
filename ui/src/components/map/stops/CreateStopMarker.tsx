import React from 'react';
import { useDispatch } from 'react-redux';
import { theme } from '../../../generated/theme';
import { useCallbackOnKeyEscape } from '../../../hooks';
import { resetEnabledModesAction } from '../../../redux';
import { Coords } from '../../../types';
import { Circle } from '../markers';

const { colors } = theme;

interface Props {
  onCursorMove?: (coords: Coords) => void;
}
export const CreateStopMarker = ({ onCursorMove }: Props): JSX.Element => {
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

    onCursorMove?.({ x, y });

    setMouseCoords({ x, y });
  };

  const onMouseLeave = () => {
    // hide marker if the mouse leaves from the map area
    setMouseCoords(undefined);
  };

  const resetModes = () => dispatch(resetEnabledModesAction());
  useCallbackOnKeyEscape(resetModes);

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
