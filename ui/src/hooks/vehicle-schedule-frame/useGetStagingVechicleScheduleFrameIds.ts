import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetStagingVehicleScheduleFrameIdsAsyncQuery } from '../../generated/graphql';

const GQL_GET_STAGING_VEHICLE_SCHEDULE_FRAME_IDS = gql`
  query GetStagingVehicleScheduleFrameIds {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: { priority: { _eq: 40 } }
      ) {
        vehicle_schedule_frame_id
      }
    }
  }
`;
export const useGetStagingVehicleScheduleFrameIds = () => {
  const [getStagingVehicleScheduleFrameIdsQuery] =
    useGetStagingVehicleScheduleFrameIdsAsyncQuery();

  const fetchStagingVehicleFrameIds = useCallback(async () => {
    const result = await getStagingVehicleScheduleFrameIdsQuery({});

    const vehicleScheduleFrames =
      result.data?.timetables
        ?.timetables_vehicle_schedule_vehicle_schedule_frame ?? [];

    const stagedVehicleScheduleFrameIds = vehicleScheduleFrames.map(
      (frame) => frame.vehicle_schedule_frame_id,
    );

    return stagedVehicleScheduleFrameIds;
  }, [getStagingVehicleScheduleFrameIdsQuery]);

  return { fetchStagingVehicleFrameIds };
};
