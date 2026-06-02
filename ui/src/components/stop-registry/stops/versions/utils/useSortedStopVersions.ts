import {
  VersionTableSortingInfo,
  useSortedVersions,
} from '../../../../common/versions';
import { StopVersion } from '../types';

export function useSortedStopVersions(
  sortingInfo: VersionTableSortingInfo,
  stopVersions: ReadonlyArray<StopVersion>,
): ReadonlyArray<StopVersion> {
  return useSortedVersions(sortingInfo, stopVersions);
}
