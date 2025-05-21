import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import { useGetToReplaceVehicleScheduleFramesLazyQuery } from '../../../../generated/graphql';
import { TimetablePriority } from '../../../../types/enums';

const GQL_GET_REPLACED_VEHICLE_SCHEDULE_FRAMES = gql`
  query GetToReplaceVehicleScheduleFrames(
    $arg1: ToReplaceVehicleScheduleFrameIdsInput!
  ) {
    toReplaceVehicleScheduleFrameIds(arg1: $arg1) {
      toReplaceVehicleScheduleFrameIds
    }
  }
`;
export const useToReplaceVehicleScheduleFrames = () => {
  const [getReplacedQuery] = useGetToReplaceVehicleScheduleFramesLazyQuery();

  const fetchToReplaceFrames = useCallback(
    async (ids: ReadonlyArray<UUID>, targetPriority: TimetablePriority) => {
      try {
        const replacedPromises = ids.map(async (id) => {
          return getReplacedQuery({
            variables: {
              arg1: {
                targetPriority,
                stagingVehicleScheduleFrameId: id,
              },
            },
          });
        });

        const replaced = (await Promise.all(replacedPromises)).flatMap(
          (response) =>
            response.data?.toReplaceVehicleScheduleFrameIds
              ?.toReplaceVehicleScheduleFrameIds,
        );

        return compact(replaced);
      } catch (error) {
        throw new Error(
          `Failed to fetch to replace vehicle schedule frames: ${error}`,
        );
      }
    },
    [getReplacedQuery],
  );

  return { fetchToReplaceFrames };
};
