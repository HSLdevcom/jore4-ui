import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimetablePriority } from '../../../../types/enums';
import { showDangerToastWithError } from '../../../../utils';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../useVehicleScheduleFrameWithJourneys';
import {
  VehicleJourneyInfo,
  useCreateVehicleJourneyInfo,
} from './useCreateVehicleJourneyInfo';
import { useFindDuplicateJourneys } from './useFindDuplicateJourneys';

export const useDuplicateJourneyDeviations = (
  fetchToCombineTargetFrameId: (
    stagingFrameId: UUID,
    targetPriority: number,
  ) => Promise<UUID | null>,
  fetchVehicleFrames: (
    ids: UUID[],
  ) => Promise<VehicleScheduleVehicleScheduleFrameWithJourneys[]>,
  fetchStagingVehicleFrameIds: () => Promise<UUID[]>,
) => {
  const { t } = useTranslation();
  const { createVehicleJourneyInfo } = useCreateVehicleJourneyInfo();
  const { findDuplicateJourneys } = useFindDuplicateJourneys();

  const [duplicateJourneys, setDuplicateJourneys] = useState<
    {
      stagingJourney: VehicleJourneyInfo;
      targetJourney: VehicleJourneyInfo;
    }[]
  >([]);

  const fetchDuplicateJourneys = useCallback(
    async (targetPriority: TimetablePriority) => {
      try {
        const stagedVehicleScheduleFrameIds =
          await fetchStagingVehicleFrameIds();

        if (!stagedVehicleScheduleFrameIds) {
          setDuplicateJourneys([]);
          return;
        }

        const toCombineTargetIds = await Promise.all(
          stagedVehicleScheduleFrameIds.map(async (stagingFrameId) => {
            const combineTargetFrameId = await fetchToCombineTargetFrameId(
              stagingFrameId,
              targetPriority,
            );
            return { stagingFrameId, combineTargetFrameId };
          }),
        );
        const withValidTargets = toCombineTargetIds.filter(
          (a) => !!a.combineTargetFrameId,
        );

        if (!withValidTargets.length) {
          setDuplicateJourneys([]);
          return;
        }

        const stagingAndTargetFrames = await Promise.all(
          withValidTargets.map(async (stagingAndTarget) => {
            const [[stagingFrame], [targetFrame]] = await Promise.all([
              fetchVehicleFrames([stagingAndTarget.stagingFrameId]),
              fetchVehicleFrames([
                stagingAndTarget.combineTargetFrameId as UUID /* filtered earlier, can't be null here */,
              ]),
            ]);
            return {
              stagingFrame,
              targetFrame,
            };
          }),
        );

        const foundDuplicateJourneys = findDuplicateJourneys(
          stagingAndTargetFrames.map(({ stagingFrame, targetFrame }) => {
            return {
              stagingFrameJourneys: createVehicleJourneyInfo(stagingFrame),
              targetFrameJourneys: createVehicleJourneyInfo(targetFrame),
            };
          }),
        );

        setDuplicateJourneys(foundDuplicateJourneys);
      } catch (error) {
        showDangerToastWithError(
          t('timetablesPreview.duplicateJourneysFetchFailed'),
          error,
        );
        setDuplicateJourneys([]);
      }
    },
    [
      fetchStagingVehicleFrameIds,
      fetchToCombineTargetFrameId,
      fetchVehicleFrames,
      createVehicleJourneyInfo,
      findDuplicateJourneys,
      t,
    ],
  );

  const clearDuplicateJourneys = useCallback(() => {
    setDuplicateJourneys([]);
  }, []);

  return { duplicateJourneys, fetchDuplicateJourneys, clearDuplicateJourneys };
};
