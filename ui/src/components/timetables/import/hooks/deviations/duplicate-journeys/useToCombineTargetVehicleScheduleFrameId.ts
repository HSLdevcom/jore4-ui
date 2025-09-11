import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetToCombineTargetVehicleScheduleFrameIdLazyQuery } from '../../../../../../generated/graphql';
import { TimetablePriority } from '../../../../../../types/enums';

const GQL_GET_COMBINE_TARGET_VEHICLE_SCHEDULE_FRAME_ID = gql`
  query GetToCombineTargetVehicleScheduleFrameId(
    $arg1: ToCombineTargetVehicleScheduleFrameIdInput!
  ) {
    toCombineTargetVehicleScheduleFrameId(arg1: $arg1) {
      toCombineTargetVehicleScheduleFrameId
    }
  }
`;
export const useToCombineTargetVehicleScheduleFrameId = () => {
  const [getCombineTargetIdQuery] =
    useGetToCombineTargetVehicleScheduleFrameIdLazyQuery();

  const fetchToCombineTargetFrameId = useCallback(
    async (
      stagingVehicleScheduleFrameId: UUID,
      targetPriority: TimetablePriority,
    ) => {
      try {
        const response = await getCombineTargetIdQuery({
          variables: {
            arg1: {
              stagingVehicleScheduleFrameId,
              targetPriority,
            },
          },
        });

        const foundTargetFrameId =
          response.data?.toCombineTargetVehicleScheduleFrameId
            ?.toCombineTargetVehicleScheduleFrameId;
        return foundTargetFrameId ?? null;
      } catch (error) {
        throw new Error(
          `Failed to fetch to combine target vehicle schedule frames: ${error}`,
        );
      }
    },
    [getCombineTargetIdQuery],
  );

  return { fetchToCombineTargetFrameId };
};
