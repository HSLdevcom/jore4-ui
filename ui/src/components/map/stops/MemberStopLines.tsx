import { MultiLineString, Position } from 'geojson';
import { FC, useMemo } from 'react';
import { useAppSelector } from '../../../hooks';
import { selectSelectedStopAreaId } from '../../../redux';
import { getPointPosition } from '../../../utils';
import { LinePaint, LineRenderLayer } from '../routes';
import { MapStop, MapStopArea } from '../types';

const memberLinePaint: Partial<LinePaint> = {
  'line-offset': 0,
  'line-width': 4,
};

function useSelectedStops(
  stops: ReadonlyArray<MapStop>,
  selectedStopAreaId: string | null | undefined,
): ReadonlyArray<MapStop> {
  return useMemo(() => {
    if (!selectedStopAreaId) {
      return [];
    }

    return stops.filter((it) => it.stop_place_netex_id === selectedStopAreaId);
  }, [selectedStopAreaId, stops]);
}

function useTargetPosition(
  areas: ReadonlyArray<MapStopArea>,
  selectedStopAreaId: string | null | undefined,
): Position | null {
  return useMemo(() => {
    if (selectedStopAreaId) {
      return getPointPosition(
        areas.find((it) => it.netex_id === selectedStopAreaId)?.centroid,
      );
    }

    return null;
  }, [selectedStopAreaId, areas]);
}

function useMemberLines(
  stops: ReadonlyArray<MapStop>,
  areas: ReadonlyArray<MapStopArea>,
): MultiLineString | null {
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const selectedStops = useSelectedStops(stops, selectedStopAreaId);
  const targetPosition = useTargetPosition(areas, selectedStopAreaId);

  return useMemo<MultiLineString | null>(() => {
    if (!selectedStops.length || !targetPosition) {
      return null;
    }

    return {
      type: 'MultiLineString',
      coordinates: selectedStops.map((it) => [
        targetPosition,
        it.location.coordinates,
      ]),
    };
  }, [selectedStops, targetPosition]);
}

type MemberStopLinesProps = {
  readonly areas: ReadonlyArray<MapStopArea>;
  readonly stops: ReadonlyArray<MapStop>;
};

export const MemberStopLines: FC<MemberStopLinesProps> = ({ areas, stops }) => {
  const memberLines = useMemberLines(stops, areas);

  if (!memberLines) {
    return null;
  }

  return (
    <LineRenderLayer
      layerId="MemberLines"
      geometry={memberLines}
      paint={memberLinePaint}
    />
  );
};
