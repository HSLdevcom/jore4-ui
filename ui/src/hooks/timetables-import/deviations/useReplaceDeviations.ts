import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimetablePriority } from '../../../types/enums';
import { showDangerToastWithError } from '../../../utils';
import {
  VehicleScheduleFrameInfo,
  useCreateVehicleScheduleFrameInfo,
} from './useCreateVehicleScheduleFrameInfo';
import { useFindOrphanRoutes } from './useFindOrphanRoutes';
import { VehicleScheduleVehicleScheduleFrameWithRoutes } from './useVehicleScheduleFrameWithRouteLabelAndLineId';

export const useReplaceDeviations = (
  fetchToReplaceFrames: (
    ids: UUID[],
    targetPriority: number,
  ) => Promise<UUID[]>,
  fetchVehicleFrames: (
    ids: UUID[],
  ) => Promise<VehicleScheduleVehicleScheduleFrameWithRoutes[]>,
  fetchStagingVehicleFrameIds: () => Promise<UUID[]>,
) => {
  const { t } = useTranslation();
  const { createVehicleScheduleFrameInfo } =
    useCreateVehicleScheduleFrameInfo();
  const { findOrphanRoutes } = useFindOrphanRoutes();

  const [deviations, setDeviations] = useState<VehicleScheduleFrameInfo[]>([]);

  const fetchRouteDeviations = useCallback(
    async (targetPriority: TimetablePriority) => {
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

        const [toReplaceVehicleScheduleFrames, stagedVehicleScheduleFrames] =
          await Promise.all([
            fetchVehicleFrames(toReplace),
            fetchVehicleFrames(stagedVehicleScheduleFrameIds),
          ]);

        const foundDeviations = findOrphanRoutes({
          toReplaceRoutes: createVehicleScheduleFrameInfo(
            toReplaceVehicleScheduleFrames,
          ),
          stagingRoutes: createVehicleScheduleFrameInfo(
            stagedVehicleScheduleFrames,
          ),
        });

        setDeviations(foundDeviations);
      } catch (error) {
        showDangerToastWithError(
          t('timetablesPreview.deviationFetchFailed'),
          error,
        );
        setDeviations([]);
      }
    },
    [
      createVehicleScheduleFrameInfo,
      fetchStagingVehicleFrameIds,
      fetchToReplaceFrames,
      fetchVehicleFrames,
      findOrphanRoutes,
      t,
    ],
  );

  const clearRouteDeviations = useCallback(() => {
    setDeviations([]);
  }, []);

  return { deviations, fetchRouteDeviations, clearRouteDeviations };
};
