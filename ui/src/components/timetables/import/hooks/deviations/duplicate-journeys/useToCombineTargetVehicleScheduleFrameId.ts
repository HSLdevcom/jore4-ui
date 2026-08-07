import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetToCombineTargetVehicleScheduleFrameIdDocument,
  GetToCombineTargetVehicleScheduleFrameIdQuery,
  GetToCombineTargetVehicleScheduleFrameIdQueryVariables,
} from '../../../../../../generated/graphql';
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
  const apollo = useApolloClient();

  const fetchToCombineTargetFrameId = useCallback(
    async (
      stagingVehicleScheduleFrameId: UUID,
      targetPriority: TimetablePriority,
    ) => {
      try {
        const { data } = await apollo.query<
          GetToCombineTargetVehicleScheduleFrameIdQuery,
          GetToCombineTargetVehicleScheduleFrameIdQueryVariables
        >({
          query: GetToCombineTargetVehicleScheduleFrameIdDocument,
          variables: {
            arg1: { stagingVehicleScheduleFrameId, targetPriority },
          },
        });

        return (
          data.toCombineTargetVehicleScheduleFrameId
            ?.toCombineTargetVehicleScheduleFrameId ?? null
        );
      } catch (error) {
        throw new Error(
          `Failed to fetch to combine target vehicle schedule frames: ${error}`,
        );
      }
    },
    [apollo],
  );

  return { fetchToCombineTargetFrameId };
};
