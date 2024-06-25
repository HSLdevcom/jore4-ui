import { Marker } from 'react-map-gl/maplibre';
import { MemberStopFieldsFragment } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { getGeometryPoint } from '../../../utils';
import { Circle } from '../markers';

const testIds = {
  memberStop: ({ id }: MemberStopFieldsFragment) =>
    `Map::StopArea::memberStop::${id}`,
};

type MemberStopProps = {
  stop: MemberStopFieldsFragment;
};

export const MemberStop = ({ stop }: MemberStopProps) => {
  const point = getGeometryPoint(stop.centroid);

  if (!point) {
    return null;
  }

  console.log('Stop at:', point);

  return (
    <Marker latitude={point.latitude} longitude={point.longitude}>
      <Circle
        borderColor={theme.colors.tweakedBrand}
        size={30}
        testId={testIds.memberStop(stop)}
      />
    </Marker>
  );
};
