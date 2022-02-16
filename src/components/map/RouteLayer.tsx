import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { useGetRouteDetailsByIdsQuery } from '../../generated/graphql';
import { theme } from '../../generated/theme';
import { mapRouteDetailsResult } from '../../graphql';
import { mapGeoJSONtoFeature, mapToVariables } from '../../utils';

const { colors } = theme;

interface Props {
  routeId: string;
}

export const RouteLayer = ({ routeId }: Props) => {
  const routeDetailsResult = useGetRouteDetailsByIdsQuery(
    mapToVariables({ route_ids: [routeId] }),
  );
  const routeDetails = mapRouteDetailsResult(routeDetailsResult);

  // do not render anything before data is received
  if (!routeDetails?.route_shape) {
    return null;
  }

  const layerStyle = {
    id: `route_${routeId}`,
    type: 'line' as const,
    paint: {
      'line-color': colors.stop,
      'line-width': 8,
      'line-opacity': 0.75,
    },
  };

  return (
    <Source type="geojson" data={mapGeoJSONtoFeature(routeDetails.route_shape)}>
      <Layer {...layerStyle} />
    </Source>
  );
};
