import { Marker } from 'react-map-gl/maplibre';
import { StopAreaMinimalShowOnMapFieldsFragment } from '../../../generated/graphql';
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
  const point = getGeometryPoint(area.centroid);
  if (!point) {
    return null;
  }

  return (
    <Marker longitude={point.longitude} latitude={point.latitude}>
      <StopAreaMarker
        onClick={() => onClick(area)}
        selected={selected}
        size={selected ? 32 : 30}
        testId={testIds.stopArea(area)}
      />
    </Marker>
  );
};
