import { QueryRoot, RouteRoute } from '../generated/graphql';
import { GqlQueryResult, GqlQueryResultData } from './types';

type RouteLike = Pick<RouteRoute, '__typename'>;
type QueryRootLike<T> = Pick<QueryRoot, '__typename'> & T;

// TODO: extend and generalize this for other query results too

// eslint-disable-next-line camelcase
type RoutePkQueryResult = QueryRootLike<{ route_route_by_pk?: RouteLike }>;
// eslint-disable-next-line camelcase
type RouteQueryResult = QueryRootLike<{ route_route?: RouteLike[] }>;

const isRouteQueryResult = (
  result: GqlQueryResult<GqlQueryResultData>,
): result is GqlQueryResult<RouteQueryResult> => {
  return !!result.data && 'route_route' in result.data;
};
export const mapRouteResultToRoute = (
  result: GqlQueryResult<RoutePkQueryResult> | GqlQueryResult<RouteQueryResult>,
) =>
  (isRouteQueryResult(result)
    ? result.data?.route_route?.[0]
    : result.data?.route_route_by_pk) as RouteRoute | undefined;

export const mapRouteResultToRoutes = (
  result: GqlQueryResult<RouteQueryResult>,
) => (result.data?.route_route || []) as RouteRoute[];
