import { MultiLineString, Position } from 'geojson';
import { FC, useMemo } from 'react';
import { useAppSelector } from '../../../hooks';
import {
  selectSelectedStopAreaId,
  selectSelectedTerminalId,
} from '../../../redux';
import { getPointPosition } from '../../../utils';
import { LinePaint, LineRenderLayer } from '../routes';
import { MapStop, MapStopArea, MapTerminal } from '../types';

const memberLinePaint: Partial<LinePaint> = {
  'line-offset': 0,
  'line-width': 4,
};

type MemberLineInfo = {
  readonly memberStops: ReadonlyArray<MapStop>;
  readonly targetPosition: Position;
};

function useStopAreaMemberInfo(
  stops: ReadonlyArray<MapStop>,
  areas: ReadonlyArray<MapStopArea>,
): MemberLineInfo | null {
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);

  const memberStops: ReadonlyArray<MapStop> = useMemo(() => {
    if (!selectedStopAreaId) {
      return [];
    }

    return stops.filter((it) => it.stop_place_netex_id === selectedStopAreaId);
  }, [selectedStopAreaId, stops]);

  const targetPosition: Position | null = useMemo(() => {
    if (selectedStopAreaId) {
      return getPointPosition(
        areas.find((it) => it.netex_id === selectedStopAreaId)?.centroid,
      );
    }

    return null;
  }, [selectedStopAreaId, areas]);

  if (memberStops.length && targetPosition) {
    return { memberStops, targetPosition };
  }

  return null;
}

function useTerminalMemberInfo(
  stops: ReadonlyArray<MapStop>,
  terminals: ReadonlyArray<MapTerminal>,
): MemberLineInfo | null {
  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);
  const selectedTerminal = useMemo(
    () => terminals.find((it) => it.netex_id === selectedTerminalId) ?? null,
    [selectedTerminalId, terminals],
  );

  const memberStops: ReadonlyArray<MapStop> = useMemo(() => {
    const childAreaIds =
      selectedTerminal?.children.map((it) => it.netexId) ?? null;

    if (!childAreaIds?.length) {
      return [];
    }

    return stops.filter((it) => childAreaIds.includes(it.stop_place_netex_id));
  }, [selectedTerminal, stops]);

  const targetPosition = getPointPosition(selectedTerminal?.centroid);

  if (memberStops.length && targetPosition) {
    return { memberStops, targetPosition };
  }

  return null;
}

function useMemberLines(
  stops: ReadonlyArray<MapStop>,
  areas: ReadonlyArray<MapStopArea>,
  terminals: ReadonlyArray<MapTerminal>,
): MultiLineString | null {
  const stopAreaMemberInfo = useStopAreaMemberInfo(stops, areas);
  const terminalMemberInfo = useTerminalMemberInfo(stops, terminals);

  const { memberStops = null, targetPosition = null } =
    stopAreaMemberInfo ?? terminalMemberInfo ?? {};

  return useMemo<MultiLineString | null>(() => {
    if (!memberStops || !targetPosition) {
      return null;
    }

    return {
      type: 'MultiLineString',
      coordinates: memberStops.map((it) => [
        targetPosition,
        it.location.coordinates,
      ]),
    };
  }, [memberStops, targetPosition]);
}

type MemberStopLinesProps = {
  readonly areas: ReadonlyArray<MapStopArea>;
  readonly stops: ReadonlyArray<MapStop>;
  readonly terminals: ReadonlyArray<MapTerminal>;
};

export const MemberStopLines: FC<MemberStopLinesProps> = ({
  areas,
  stops,
  terminals,
}) => {
  const memberLines = useMemberLines(stops, areas, terminals);

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
