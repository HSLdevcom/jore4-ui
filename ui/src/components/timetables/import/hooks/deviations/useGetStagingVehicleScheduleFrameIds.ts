import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetStagingVehicleScheduleFramesDocument,
  GetStagingVehicleScheduleFramesQuery,
} from '../../../../../generated/graphql';

export const useGetStagingVehicleScheduleFrameIds = () => {
  const apollo = useApolloClient();

  const fetchStagingVehicleFrameIds = useCallback(async () => {
    const { data } = await apollo.query<GetStagingVehicleScheduleFramesQuery>({
      query: GetStagingVehicleScheduleFramesDocument,
    });

    const stagedVehicleScheduleFrameIds =
      data.timetables?.timetables_vehicle_schedule_vehicle_schedule_frame.map(
        (frame) => frame.vehicle_schedule_frame_id,
      );

    return stagedVehicleScheduleFrameIds ?? [];
  }, [apollo]);

  return { fetchStagingVehicleFrameIds };
};
