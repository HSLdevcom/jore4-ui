import keyBy from 'lodash/keyBy';
import { useCallback, useState } from 'react';
import { NonNullableKeys } from '../../../../types';
import { TimetablePriority } from '../../../../types/enums';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from './deviations';

export const useStagingAndTargetFramesForCombine = (
  fetchToCombineTargetFrameId: (
    stagingFrameId: UUID,
    targetPriority: number,
  ) => Promise<UUID | null>,
  fetchVehicleFrames: (
    ids: ReadonlyArray<UUID>,
  ) => Promise<ReadonlyArray<VehicleScheduleVehicleScheduleFrameWithJourneys>>,
  fetchStagingVehicleFrameIds: () => Promise<ReadonlyArray<UUID>>,
) => {
  const [
    stagingAndTargetFramesForCombine,
    setStagingAndTargetFramesForCombine,
  ] = useState<
    {
      stagingFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
      targetFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
    }[]
  >([]);

  const fetchStagingAndTargetFramesForCombine = useCallback(
    async (targetPriority: TimetablePriority) => {
      try {
        const stagedVehicleScheduleFrameIds =
          await fetchStagingVehicleFrameIds();

        if (!stagedVehicleScheduleFrameIds) {
          setStagingAndTargetFramesForCombine([]);
          return;
        }

        // Fetch target frame for each staging frame.
        const toCombineTargetIds = await Promise.all(
          stagedVehicleScheduleFrameIds.map(async (stagingFrameId) => {
            const combineTargetFrameId = await fetchToCombineTargetFrameId(
              stagingFrameId,
              targetPriority,
            ).catch(() => null); // An error is thrown when there is no target.
            return { stagingFrameId, combineTargetFrameId };
          }),
        );

        // Filter out staging frames without targets: they can't be combined and thus not relevant here.
        const withValidTargets = toCombineTargetIds.filter(
          (
            ids,
          ): ids is NonNullableKeys<
            (typeof toCombineTargetIds)[number],
            'combineTargetFrameId'
          > => ids.combineTargetFrameId !== null,
        );

        if (!withValidTargets.length) {
          setStagingAndTargetFramesForCombine([]);
          return;
        }

        // Fetch all staging and target frames in one query,
        // and regroup to match the staging / target frame id pairs.
        const frameIdsToFetch = withValidTargets.flatMap((stagingAndTarget) => [
          stagingAndTarget.stagingFrameId,
          stagingAndTarget.combineTargetFrameId,
        ]);
        const fetchedFrames = await fetchVehicleFrames(frameIdsToFetch);
        const framesById = keyBy(fetchedFrames, 'vehicle_schedule_frame_id');
        const stagingAndTargetFrames = withValidTargets
          .map((stagingAndTargetIds) => {
            const stagingFrame = framesById[stagingAndTargetIds.stagingFrameId];
            const targetFrame =
              framesById[stagingAndTargetIds.combineTargetFrameId];

            return {
              stagingFrame,
              targetFrame,
            };
          })
          .filter((frames) => frames.stagingFrame && frames.targetFrame);

        setStagingAndTargetFramesForCombine(stagingAndTargetFrames);
      } catch {
        setStagingAndTargetFramesForCombine([]);
      }
    },
    [
      fetchStagingVehicleFrameIds,
      fetchToCombineTargetFrameId,
      fetchVehicleFrames,
    ],
  );

  const clearStagingAndTargetFramesForCombine = useCallback(() => {
    setStagingAndTargetFramesForCombine([]);
  }, []);

  return {
    stagingAndTargetFramesForCombine,
    fetchStagingAndTargetFramesForCombine,
    clearStagingAndTargetFramesForCombine,
  };
};
