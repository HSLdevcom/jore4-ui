import { useMemo } from 'react';
import {
  StopAreaFormFieldsFragment,
  StopRegistryStopPlace,
} from '../../../generated/graphql';
import { getPointPosition, notNullish } from '../../../utils';
import { LinePaint, LineRenderLayer } from '../routes';
import { MemberStop } from './MemberStop';

const memberLinePaint: Partial<LinePaint> = {
  'line-offset': 0,
  'line-width': 4,
};

function useMemberLines(
  area: StopAreaFormFieldsFragment,
): GeoJSON.MultiLineString | null {
  return useMemo(() => {
    const areaPosition = getPointPosition(area.geometry);
    const nonNullStops = area.members?.filter(notNullish);

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

function useMemberStops(area: StopAreaFormFieldsFragment) {
  return useMemo(() => area.members?.filter(notNullish), [area]);
}

type MemberStopsProps = {
  area: StopAreaFormFieldsFragment;
};

export const MemberStops = ({ area }: MemberStopsProps) => {
  const memberLines = useMemberLines(area);
  const memberStops = useMemberStops(area);

  return (
    <>
      {memberStops?.map((stop) => (
        <MemberStop key={stop.id} stop={stop as StopRegistryStopPlace} />
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
