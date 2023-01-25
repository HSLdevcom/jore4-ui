import {
  QueryRoot,
  RouteRoute,
  ServicePatternScheduledStopPoint,
} from '../generated/graphql';
import { GqlQueryResult, GqlQueryResultData } from './types';

type RouteLike = Pick<RouteRoute, '__typename'>;
type StopLike = Pick<ServicePatternScheduledStopPoint, '__typename'>;
type QueryRootLike<T> = Pick<QueryRoot, '__typename'> & T;

// Using a static, constant array (instead of `result || []`) as a default value for array queries
// to avoid infinite render loop caused by constantly changing object reference. This array is
// constant as we don't want anyone to write to this globally shared variable.
const emptyArray = [] as const;

// routes

type RoutePkQueryResult = QueryRootLike<{ route_route_by_pk?: RouteLike }>;
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
) => (result.data?.route_route as RouteRoute[]) || emptyArray;

// stops

type StopQueryResult = QueryRootLike<{
  service_pattern_scheduled_stop_point?: StopLike[];
}>;

export const mapStopResultToStop = (result: GqlQueryResult<StopQueryResult>) =>
  result.data?.service_pattern_scheduled_stop_point?.[0] as
    | ServicePatternScheduledStopPoint
    | undefined;

export const mapStopResultToStops = (result: GqlQueryResult<StopQueryResult>) =>
  (result.data
    ?.service_pattern_scheduled_stop_point as ServicePatternScheduledStopPoint[]) ||
  emptyArray;
