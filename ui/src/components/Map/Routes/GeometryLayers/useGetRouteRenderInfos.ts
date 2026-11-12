import { gql } from '@apollo/client';
import { useGetRouteRenderInfoByIdsQuery } from '../../../../generated/graphql';

const GQL_GET_ROUTE_RENDER_INFO_BY_IDS = gql`
  query GetRouteRenderInfoByIds($routeIds: [uuid!]!) {
    route_route(where: { route_id: { _in: $routeIds } }) {
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

export function useGetRouteRenderInfos(routeIds: ReadonlyArray<UUID>) {
  const { data } = useGetRouteRenderInfoByIdsQuery({
    variables: { routeIds: routeIds as Array<UUID> },
    skip: !routeIds.length,
  });

  return data?.route_route ?? [];
}
