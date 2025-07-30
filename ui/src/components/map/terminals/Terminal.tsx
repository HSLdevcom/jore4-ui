import { FC } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { MapEntityEditorViewState } from '../../../redux';
import { getGeometryPoint } from '../../../utils';
import { TerminalMarker } from '../markers';
import { MapTerminal } from '../types';

const testIds = {
  terminal: ({ private_code_value: id }: MapTerminal) =>
    `Map::MapTerminal::terminal::${id}`,
};

type TerminalProps = {
  readonly terminal: MapTerminal;
  readonly mapTerminalViewState: MapEntityEditorViewState;
  readonly onClick: (area: MapTerminal) => void;
  readonly selected: boolean;
};

export const Terminal: FC<TerminalProps> = ({
  terminal,
  mapTerminalViewState,
  selected,
  onClick,
}) => {
  // If the terminal is being moved, we use different styles for the stop
  // to indicate the placeholder of the old location
  const isPlaceholder =
    selected && mapTerminalViewState === MapEntityEditorViewState.MOVE;

  const point = getGeometryPoint(terminal.centroid);
  if (!point) {
    return null;
  }

  return (
    <Marker
      className="z-[2]"
      longitude={point.longitude}
      latitude={point.latitude}
      onClick={() => onClick(terminal)}
    >
      <TerminalMarker
        selected={selected}
        isPlaceholder={isPlaceholder}
        testId={testIds.terminal(terminal)}
        title={`${terminal.private_code_value}: ${terminal.name_value}`}
      />
    </Marker>
  );
};
