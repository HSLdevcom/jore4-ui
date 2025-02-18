import { useMemo } from 'react';
import { EnrichedStopPlace } from '../../../hooks';
import { getPointPosition, notNullish } from '../../../utils';
import { LinePaint, LineRenderLayer } from '../routes';
import { MemberStop } from './MemberStop';

const memberLinePaint: Partial<LinePaint> = {
  'line-offset': 0,
  'line-width': 4,
};

function useMemberLines(
  area: EnrichedStopPlace,
): GeoJSON.MultiLineString | null {
  return useMemo(() => {
    const areaPosition = getPointPosition(area.geometry);
    const nonNullStops = area.quays?.filter(notNullish);

    if (!areaPosition || !nonNullStops) {
      return null;
    }

    return {
      type: 'MultiLineString',
      coordinates: nonNullStops
        .map((it) => it.geometry)
        .map(getPointPosition)
        .filter(notNullish)
        .map((memberPosition) => [areaPosition, memberPosition]),
    };
  }, [area]);
}

function useMemberStops(area: EnrichedStopPlace) {
  return useMemo(() => area.quays?.filter(notNullish), [area]);
}

type MemberStopsProps = {
  area: EnrichedStopPlace;
};

export const MemberStops = ({ area }: MemberStopsProps) => {
  const memberLines = useMemberLines(area);
  const memberStops = useMemberStops(area);

  return (
    <>
      {memberStops?.map((stop) => <MemberStop key={stop.id} stop={stop} />)}

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
