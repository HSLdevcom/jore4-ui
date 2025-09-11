import { useCallback } from 'react';
import { useGetStagingVehicleScheduleFramesLazyQuery } from '../../../../../generated/graphql';

export const useGetStagingVehicleScheduleFrameIds = () => {
  const [getStagingVehicleScheduleFramesQuery] =
    useGetStagingVehicleScheduleFramesLazyQuery();

  const fetchStagingVehicleFrameIds = useCallback(async () => {
    const result = await getStagingVehicleScheduleFramesQuery({
      variables: {},
    });

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
