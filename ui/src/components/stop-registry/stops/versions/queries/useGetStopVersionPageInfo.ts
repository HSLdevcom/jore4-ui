import { VersionStatus } from '../../../../common';
import { StopPlaceName, StopVersion } from '../types';
import { useGetStopPlaceName } from './useGetStopPlaceName';
import { useGetStopVersions } from './useGetStopVersions';

function active(stopVersion: StopVersion) {
  return stopVersion.status === VersionStatus.ACTIVE;
}

function properVersion(stopVersion: StopVersion) {
  return (
    stopVersion.status === VersionStatus.STANDARD ||
    stopVersion.status === VersionStatus.TEMPORARY
  );
}

function resolveStopPlaceId(
  stopVersions: ReadonlyArray<StopVersion> | null,
): string | null {
  if (!stopVersions || stopVersions.length === 0) {
    return null;
  }

  const activeStopVersion = stopVersions.find(active);
  if (activeStopVersion) {
    return activeStopVersion.stop_place_netex_id;
  }

  const lastProperVersion = stopVersions.findLast(properVersion);
  if (lastProperVersion) {
    return lastProperVersion.stop_place_netex_id;
  }

  return stopVersions[stopVersions.length - 1].stop_place_netex_id;
}

type GetStopVersionPageInfoLoading = {
  readonly loading: true;
  readonly stopVersions: null;
  readonly stopPlaceName: null;
};

type GetStopVersionPageInfoLoaded = {
  readonly loading: false;
  readonly stopVersions: ReadonlyArray<StopVersion>;
  readonly stopPlaceName: StopPlaceName;
};

export function useGetStopVersionPageInfo(
  publicCode: string,
): GetStopVersionPageInfoLoading | GetStopVersionPageInfoLoaded {
  const { stopVersions, loading: loadingStopVersions } =
    useGetStopVersions(publicCode);

  const stopPlaceId = resolveStopPlaceId(stopVersions);
  const { stopPlaceName, loading: loadingStopPlaceName } =
    useGetStopPlaceName(stopPlaceId);

  if (loadingStopVersions || loadingStopPlaceName) {
    return { loading: true, stopVersions: null, stopPlaceName: null };
  }

  return { loading: false, stopVersions, stopPlaceName };
}
