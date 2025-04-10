import type { LineString } from 'geojson';
import { FC } from 'react';
import { StopInfoForEditingOnMap } from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import { LineRenderLayer } from '../routes';

type LineToClosestInfraLinkProps = { readonly stop: StopInfoForEditingOnMap };

export const LineToClosestInfraLink: FC<LineToClosestInfraLinkProps> = ({
  stop,
}) => {
  if (!stop.closestPointOnInfraLink) {
    return null;
  }

  const lineToInfraLink: LineString = {
    type: 'LineString',
    coordinates: [
      [stop.formState.longitude, stop.formState.latitude],
      stop.closestPointOnInfraLink.coordinates,
    ],
  };

  return (
    <LineRenderLayer
      layerId="MemberLines"
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
