import { FC } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { MapEntityEditorViewState } from '../../../redux';
import {
  getGeometryPoint,
  mapTransportModeToColor,
  parseStopRegistryTransportMode,
} from '../../../utils';
import { StopAreaMarker } from '../markers';
import { MapStopArea } from '../types';

const testIds = {
  stopArea: ({ private_code_value: id }: MapStopArea) =>
    `Map::StopArea::stopArea::${id}`,
};

type StopAreaProps = {
  readonly area: MapStopArea;
  readonly mapStopAreaViewState: MapEntityEditorViewState;
  readonly onClick: (area: MapStopArea) => void;
  readonly selected: boolean;
};

export const StopArea: FC<StopAreaProps> = ({
  area,
  mapStopAreaViewState,
  selected,
  onClick,
}) => {
  // If the stop area is being moved, we use different styles for the stop
  // to indicate the placeholder of the old location
  const isPlaceholder =
    selected && mapStopAreaViewState === MapEntityEditorViewState.MOVE;

  const point = getGeometryPoint(area.centroid);
  if (!point) {
    return null;
  }

  const transportMode = parseStopRegistryTransportMode(area.transport_mode);
  const color = mapTransportModeToColor(transportMode);

  return (
    <Marker
      className="z-1"
      longitude={point.longitude}
      latitude={point.latitude}
    >
      <StopAreaMarker
        onClick={() => onClick(area)}
        selected={selected}
        isPlaceholder={isPlaceholder}
        color={color}
        testId={testIds.stopArea(area)}
        title={`${area.private_code_value} ${area.name_value}`}
      />
    </Marker>
  );
};
