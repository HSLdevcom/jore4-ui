import type { LineString } from 'geojson';
import { FC } from 'react';
import { MapInstance } from 'react-map-gl/dist/maplibre';
import { useMap } from 'react-map-gl/maplibre';
import { Point } from '../../../types';
import { findNearestPointOnARoad } from '../../../utils/map';
import { StopInfoForEditingOnMap } from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import { LineRenderLayer } from '../routes';

function linestringFromStop(
  stop: StopInfoForEditingOnMap | null,
): LineString | null {
  if (!stop?.closestPointOnInfraLink) {
    return null;
  }

  return {
    type: 'LineString',
    coordinates: [
      [stop.formState.longitude, stop.formState.latitude],
      stop.closestPointOnInfraLink.coordinates,
    ],
  };
}

function linestringFromDraftLocation(
  map: MapInstance | undefined,

  draftLocation: Point | null,
): LineString | null {
  if (!draftLocation) {
    return null;
  }

  const pointOnInfraLink = findNearestPointOnARoad(map, draftLocation);

  if (!pointOnInfraLink) {
    return null;
  }

  return {
    type: 'LineString',
    coordinates: [
      [draftLocation.longitude, draftLocation.latitude],
      pointOnInfraLink.coordinates,
    ],
  };
}

type LineToClosestInfraLinkProps = {
  readonly draftLocation: Point | null;
  readonly stop: StopInfoForEditingOnMap | null;
};

export const LineToClosestInfraLink: FC<LineToClosestInfraLinkProps> = ({
  draftLocation,
  stop,
}) => {
  const { current: map } = useMap();

  const lineToInfraLink: LineString | null =
    linestringFromStop(stop) ??
    linestringFromDraftLocation(map?.getMap(), draftLocation);

  if (!lineToInfraLink) {
    return null;
  }

  return (
    <LineRenderLayer
      layerId="LineToClosestInfraLink"
      geometry={lineToInfraLink}
      layout={{
        'line-cap': 'round',
      }}
      paint={{
        'line-color': 'darkGrey',
        'line-width': 4,
        'line-opacity': 1,
        'line-offset': 0,
        'line-dasharray': [1, 1.5],
      }}
    />
  );
};
