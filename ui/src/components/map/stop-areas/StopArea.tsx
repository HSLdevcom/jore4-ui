import { Marker } from 'react-map-gl/maplibre';
import { StopAreaMinimalShowOnMapFieldsFragment } from '../../../generated/graphql';
import { useAppSelector } from '../../../hooks';
import { selectIsMoveStopAreaModeEnabled } from '../../../redux';
import { getGeometryPoint } from '../../../utils';
import { StopAreaMarker } from '../markers';

const testIds = {
  stopArea: ({ id }: StopAreaMinimalShowOnMapFieldsFragment) =>
    `Map::StopArea::stopArea::${id}`,
};

type StopAreaProps = {
  area: StopAreaMinimalShowOnMapFieldsFragment;
  onClick: (area: StopAreaMinimalShowOnMapFieldsFragment) => void;
  selected: boolean;
};

export const StopArea = ({ area, selected, onClick }: StopAreaProps) => {
  const isMoveStopAreaModeEnabled = useAppSelector(
    selectIsMoveStopAreaModeEnabled,
  );
  // If the stop area is being moved, we use different styles for the stop
  // to indicate the placeholder of the old location
  const isPlaceholder = selected && isMoveStopAreaModeEnabled;

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
