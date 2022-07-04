import { LineLayout } from 'maplibre-gl';
import { Layer, Source } from 'react-map-gl';
import { useGetRouteDetailsByIdsQuery } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { mapRouteResultToRoute } from '../../../graphql';
import { mapGeoJSONtoFeature, mapToVariables } from '../../../utils';

const { colors } = theme;

interface Props {
  routeId: string;
  isSelected: boolean;
}

export const ROUTE_LAYER_ID_PREFIX = 'route_id_';

export const mapRouteIdToLayerId = (id: UUID) =>
  `${ROUTE_LAYER_ID_PREFIX}${id}`;
export const mapLayerIdToRouteId = (id: string) =>
  id.split(ROUTE_LAYER_ID_PREFIX)[1];

export const RouteLayer = ({ routeId, isSelected }: Props) => {
  const routeDetailsResult = useGetRouteDetailsByIdsQuery(
    mapToVariables({ route_ids: [routeId] }),
  );
  const routeDetails = mapRouteResultToRoute(routeDetailsResult);

  // do not render anything before data is received
  if (!routeDetails?.route_shape || !routeDetails.route_line) {
    return null;
  }

  const beforeId = isSelected ? undefined : 'route_base';

  const vehicleMode = routeDetails.route_line.primary_vehicle_mode;

  const layerStyle = {
    id: mapRouteIdToLayerId(routeId),
    type: 'line' as const,
    paint: {
      'line-color': isSelected
        ? colors.selectedMapItem
        : colors.routes[vehicleMode],
      'line-width': isSelected ? 9 : 8,
      'line-opacity': isSelected ? 1 : 0.75,
      'line-offset': 6,
    },
    layout: {
      'line-join': 'round',
    } as LineLayout,
    beforeId,
  };

  return (
    <Source type="geojson" data={mapGeoJSONtoFeature(routeDetails.route_shape)}>
      <Layer {...layerStyle} />
    </Source>
  );
};
