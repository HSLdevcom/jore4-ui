import {
  VersionTableSortingInfo,
  useSortedVersions,
} from '../../../common/versions';
import { RouteVersion } from '../types';

export function useSortedRouteVersions(
  sortingInfo: VersionTableSortingInfo,
  routeVersions: ReadonlyArray<RouteVersion>,
): ReadonlyArray<RouteVersion> {
  return useSortedVersions(sortingInfo, routeVersions);
}
