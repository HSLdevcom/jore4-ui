import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { useGetRouteDetailsByIdQuery } from '../../generated/graphql';
import { mapRouteDetailsResult } from '../../graphql';
import { mapGeoJSONtoFeature, mapToVariables } from '../../utils';

interface Props {
  routeId: string;
}

export const RouteLayer = ({ routeId }: Props) => {
  const routeDetailsResult = useGetRouteDetailsByIdQuery(
    mapToVariables({ route_id: routeId }),
  );
  const routeDetails = mapRouteDetailsResult(routeDetailsResult);

  // do not render anything before data is received
  if (!routeDetails?.route_shape) {
    return null;
  }

  const layerStyle = {
    id: `route_${routeId}`,
    type: 'line' as const,
    paint: {},
  };

  return (
    <Source type="geojson" data={mapGeoJSONtoFeature(routeDetails.route_shape)}>
      <Layer {...layerStyle} />
    </Source>
  );
};
