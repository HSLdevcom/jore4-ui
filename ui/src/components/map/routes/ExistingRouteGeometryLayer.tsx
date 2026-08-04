import { gql } from '@apollo/client';
import { FC } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  useGetRouteRenderInfoByIdQuery,
} from '../../../generated/graphql';
import { mapToVariables } from '../../../utils';
import { mapVehicleModeToRouteColor } from '../../../utils/colors';
import { RouteGeometryLayer } from './RouteGeometryLayer';

const GQL_GET_ROUTE_RENDER_INFO_BY_ID = gql`
  query GetRouteRenderInfoById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      route_id
      route_shape
      route_line {
        line_id
        primary_vehicle_mode
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
  const routeRenderInfoResult = useGetRouteRenderInfoByIdQuery(
    mapToVariables({ routeId }),
  );
  const routeRenderInfo =
    routeRenderInfoResult.data?.route_route_by_pk ?? undefined;

  // do not render anything before data is received
  if (!routeRenderInfo?.route_shape) {
    return null;
  }

  const vehicleMode =
    routeRenderInfo.route_line?.primary_vehicle_mode ??
    ReusableComponentsVehicleModeEnum.Bus;

  const routeColor = mapVehicleModeToRouteColor(vehicleMode);

  return (
    <RouteGeometryLayer
      routeId={routeId}
      geometry={routeRenderInfo.route_shape}
      defaultColor={routeColor}
      isHighlighted={isSelected}
    />
  );
};
