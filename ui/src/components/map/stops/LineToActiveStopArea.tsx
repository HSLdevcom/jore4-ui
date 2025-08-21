import { point } from '@turf/turf';
import type { LineString, Position } from 'geojson';
import { Point as MapLibrePoint } from 'maplibre-gl';
import { FC } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { useAppSelector } from '../../../hooks';
import { selectEditedStopAreaData } from '../../../redux';
import { Point } from '../../../types';
import { LineRenderLayer } from '../routes';

type LineToActiveStopAreaProps = { readonly from: Position };

const LineToActiveStopAreaImpl: FC<LineToActiveStopAreaProps> = ({ from }) => {
  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);

  if (
    editedStopAreaData?.locationLong === undefined ||
    editedStopAreaData.locationLat === undefined
  ) {
    return null;
  }

  const lineToStopArea: LineString = {
    type: 'LineString',
    coordinates: [
      from,
      [editedStopAreaData.locationLong, editedStopAreaData.locationLat],
    ],
  };

  if (!lineToStopArea) {
    return null;
  }

  return (
    <LineRenderLayer
      layerId="LineToActiveStopArea"
      geometry={lineToStopArea}
      paint={{
        'line-offset': 0,
        'line-width': 4,
      }}
    />
  );
};

type LineToActiveStopAreaFromMouseProps = {
  readonly mouseCoords: MapLibrePoint;
};

const LineToActiveStopAreaFromMouse: FC<LineToActiveStopAreaFromMouseProps> = ({
  mouseCoords,
}) => {
  const { current: map } = useMap();

  if (!map) {
    return null;
  }

  // convert cursor location from pixel coordinates to lat/lng
  const cursorLocation = point(map.unproject(mouseCoords).toArray()).geometry;

  return <LineToActiveStopAreaImpl from={cursorLocation.coordinates} />;
};

type LineToActiveStopAreaFromDraftProps = {
  readonly draftLocation: Point | null;
};

const LineToActiveStopAreaFromDraft: FC<LineToActiveStopAreaFromDraftProps> = ({
  draftLocation,
}) => {
  if (!draftLocation) {
    return null;
  }

  return (
    <LineToActiveStopAreaImpl
      from={[draftLocation.longitude, draftLocation.latitude]}
    />
  );
};

export const LineToActiveStopArea = {
  FromMouse: LineToActiveStopAreaFromMouse,
  FromDraft: LineToActiveStopAreaFromDraft,
} as const;
