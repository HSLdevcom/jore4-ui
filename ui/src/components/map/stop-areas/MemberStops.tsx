import { useMemo } from 'react';
import { StopAreaMinimalShowOnMapFieldsFragment } from '../../../generated/graphql';
import { getPointPosition, notNullish } from '../../../utils';
import { LinePaint, LineRenderLayer } from '../routes';
import { MemberStop } from './MemberStop';

const memberLinePaint: Partial<LinePaint> = {
  'line-offset': 0,
  'line-width': 4,
};

function useMemberLines(
  area: StopAreaMinimalShowOnMapFieldsFragment,
): GeoJSON.MultiLineString | null {
  return useMemo(() => {
    const areaPosition = getPointPosition(area.centroid);
    const nonNullStops = area.members
      .map((member) => member.stop_place)
      .filter(notNullish);

    if (!areaPosition || !nonNullStops) {
      return null;
    }

    return {
      type: 'MultiLineString',
      coordinates: nonNullStops
        .map((it) => it.centroid)
        .map(getPointPosition)
        .filter(notNullish)
        .map((memberPosition) => [areaPosition, memberPosition]),
    };
  }, [area]);
}

type MemberStopsProps = {
  readonly area: StopAreaMinimalShowOnMapFieldsFragment;
};

export const MemberStops = ({ area }: MemberStopsProps) => {
  const memberLines = useMemberLines(area);

  return (
    <>
      {area.members
        ?.map((member) => member?.stop_place)
        .filter(notNullish)
        .map((stop) => (
          <MemberStop key={stop.id} stop={stop} />
        ))}

      {memberLines ? (
        <LineRenderLayer
          layerId="MemberLines"
          geometry={memberLines}
          paint={memberLinePaint}
        />
      ) : null}
    </>
  );
};
