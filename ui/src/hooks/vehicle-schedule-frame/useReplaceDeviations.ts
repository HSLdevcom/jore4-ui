import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showDangerToastWithError } from '../../utils';
import { useFindOrpanRoutes } from './useFindOrphanroutes';
import {
  VehicleScheduleFrameInfo,
  useVehicleScheduleFramesToVehicleScheduleFrameInfo,
} from './useVehicleScheduleFramesToVehicleScheduleFrameInfo';
import { VehicleScheduleVehicleScheduleFrameWithRoutes } from './useVehicleScheduleFrameWithRouteLabelAndLineId';

export const useReplaceDeviations = (
  fetchToReplaceFrames: (
    ids: string[],
    targetPriority: number,
  ) => Promise<string[]>,
  fetchVehicleFrames: (
    ids: string[],
  ) => Promise<VehicleScheduleVehicleScheduleFrameWithRoutes[]>,
  fetchStagingVehicleFrameIds: () => Promise<string[]>,
) => {
  const { t } = useTranslation();
  const { vehicleScheduleFramesToVehicleScheduleFrameInfo } =
    useVehicleScheduleFramesToVehicleScheduleFrameInfo();
  const { findOrphanRoutes } = useFindOrpanRoutes();

  const [deviations, setDeviations] = useState<VehicleScheduleFrameInfo[]>([]);

  const fetchRouteDeviations = useCallback(
    async (targetPriority: number) => {
      try {
        const stagedVehicleScheduleFrameIds =
          await fetchStagingVehicleFrameIds();

        if (!stagedVehicleScheduleFrameIds) {
          setDeviations([]);
          return;
        }
        const toReplace = await fetchToReplaceFrames(
          stagedVehicleScheduleFrameIds,
          targetPriority,
        );
        if (!toReplace) {
          setDeviations([]);
          return;
        }
        const toReplaceVehicleFramesWithRouteInfo = await fetchVehicleFrames(
          toReplace,
        );
        const stagedVehicleScheduleFramesWithRouteInfo =
          await fetchVehicleFrames(stagedVehicleScheduleFrameIds);

        const stagedVehicleScheduleFrameInfo =
          vehicleScheduleFramesToVehicleScheduleFrameInfo(
            stagedVehicleScheduleFramesWithRouteInfo,
          );

        const toReplaceVehicleScheduleFrameInfo =
          vehicleScheduleFramesToVehicleScheduleFrameInfo(
            toReplaceVehicleFramesWithRouteInfo,
          );

        const foundDeviations = findOrphanRoutes(
          toReplaceVehicleScheduleFrameInfo,
          stagedVehicleScheduleFrameInfo,
        );
        setDeviations(foundDeviations);
      } catch (error) {
        showDangerToastWithError(t('errors.deviationFetchFailed'), error);
        setDeviations([]);
      }
    },
    [
      fetchStagingVehicleFrameIds,
      fetchToReplaceFrames,
      fetchVehicleFrames,
      vehicleScheduleFramesToVehicleScheduleFrameInfo,
      findOrphanRoutes,
      t,
    ],
  );

  const clearRouteDeviations = useCallback(() => {
    setDeviations([]);
  }, []);

  return { deviations, fetchRouteDeviations, clearRouteDeviations };
};
