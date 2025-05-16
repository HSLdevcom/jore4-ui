import { FC } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { StopAreaMinimalShowOnMapFieldsFragment } from '../../../generated/graphql';
import { MapEntityEditorViewState } from '../../../redux';
import { getGeometryPoint } from '../../../utils';
import { StopAreaMarker } from '../markers';

const testIds = {
  stopArea: ({
    private_code_value: id,
  }: StopAreaMinimalShowOnMapFieldsFragment) =>
    `Map::StopArea::stopArea::${id}`,
};

type StopAreaProps = {
  readonly area: StopAreaMinimalShowOnMapFieldsFragment;
  readonly mapStopAreaViewState: MapEntityEditorViewState;
  readonly onClick: (area: StopAreaMinimalShowOnMapFieldsFragment) => void;
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

  return (
    <Marker longitude={point.longitude} latitude={point.latitude}>
      <StopAreaMarker
        onClick={() => onClick(area)}
        selected={selected}
        isPlaceholder={isPlaceholder}
        testId={testIds.stopArea(area)}
      />
    </Marker>
  );
};
