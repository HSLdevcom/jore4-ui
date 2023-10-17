import { useCallback } from 'react';
import { useGetStagingVehicleScheduleFramesAsyncQuery } from '../../../generated/graphql';

export const useGetStagingVehicleScheduleFrameIds = () => {
  const [getStagingVehicleScheduleFramesQuery] =
    useGetStagingVehicleScheduleFramesAsyncQuery();

  const fetchStagingVehicleFrameIds = useCallback(async () => {
    const result = await getStagingVehicleScheduleFramesQuery({});

    const vehicleScheduleFrames =
      result.data?.timetables
        ?.timetables_vehicle_schedule_vehicle_schedule_frame ?? [];

    const stagedVehicleScheduleFrameIds = vehicleScheduleFrames.map(
      (frame) => frame.vehicle_schedule_frame_id,
    );

    return stagedVehicleScheduleFrameIds;
  }, [getStagingVehicleScheduleFramesQuery]);

  return { fetchStagingVehicleFrameIds };
};
