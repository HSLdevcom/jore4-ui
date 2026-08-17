import { gql } from '@apollo/client';
import { FC } from 'react';
import { useGetRouteRenderInfoByIdQuery } from '../../../generated/graphql';
import { mapVehicleModeToRouteColor } from '../utils/colors';
import { RouteGeometryLayer } from './RouteGeometryLayer';

const GQL_GET_ROUTE_RENDER_INFO_BY_ID = gql`
  query GetRouteRenderInfoById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      route_id
      route_shape
      route_line {
        line_id
        primary_vehicle_mode
        type_of_line
      }
    }
  }
`;

type ExistingRouteGeometryLayerProps = {
  readonly routeId: string;
  readonly isSelected: boolean;
};

// This layer fetches a single route's geometry and renders it as a line
export const ExistingRouteGeometryLayer: FC<
  ExistingRouteGeometryLayerProps
> = ({ routeId, isSelected }) => {
  const { data } = useGetRouteRenderInfoByIdQuery({
    variables: { routeId },
  });
  const routeRenderInfo = data?.route_route_by_pk;

  // do not render anything before data is received
  if (!routeRenderInfo?.route_shape) {
    return null;
  }

  const routeColor = mapVehicleModeToRouteColor(
    routeRenderInfo.route_line.primary_vehicle_mode,
    routeRenderInfo.route_line.type_of_line,
  );

  return (
    <RouteGeometryLayer
      routeId={routeId}
      geometry={routeRenderInfo.route_shape}
      defaultColor={routeColor}
      isHighlighted={isSelected}
    />
  );
};
