import { TimetablesRouteDirectionEnum } from '../../../../generated/graphql';
import { RouteVersion } from '../types';
import { useGetRouteVersions } from './useGetRouteVersions';

type GetRouteVersionPageInfoLoading = {
  readonly loading: true;
};

type GetRouteVersionPageInfoLoaded = {
  readonly loading: false;
  readonly routeVersions: ReadonlyArray<RouteVersion>;
  readonly lineName?: string;
};

type GetRouteVersionPageInfo =
  | GetRouteVersionPageInfoLoading
  | GetRouteVersionPageInfoLoaded;

export function useGetRouteVersionPageInfo(
  label: string,
  direction: TimetablesRouteDirectionEnum,
): GetRouteVersionPageInfo {
  const { loading, routeVersions, lineName } = useGetRouteVersions(
    label,
    direction,
  );

  if (loading) {
    return { loading: true };
  }

  return {
    loading: false,
    routeVersions,
    lineName,
  };
}
