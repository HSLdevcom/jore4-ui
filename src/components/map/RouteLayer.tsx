import React from 'react';
import { Layer, Source } from 'react-map-gl';
import { useGetRouteDetailsByIdQuery } from '../../generated/graphql';
import { mapRouteDetailsResult } from '../../graphql/route';
import { mapToVariables } from '../../utils';

interface Props {
  routeId: string;
}

export const RouteLayer = ({ routeId }: Props): JSX.Element => {
  const routeDetailsResult = useGetRouteDetailsByIdQuery(
    mapToVariables({ route_id: routeId }),
  );
  const routeDetails = mapRouteDetailsResult(routeDetailsResult);
  const layerStyle = {
    id: 'point',
    type: 'line' as const,
    paint: {},
  };
  return (
    <Source type="geojson" data={routeDetails?.route_shape}>
      <Layer {...layerStyle} />
    </Source>
  );
};
