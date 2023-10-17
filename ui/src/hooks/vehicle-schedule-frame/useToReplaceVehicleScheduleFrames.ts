import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import { useGetToReplaceVehicleScheduleFramesAsyncQuery } from '../../generated/graphql';
import { log } from '../../utils';

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
  const [getReplacedQuery] = useGetToReplaceVehicleScheduleFramesAsyncQuery();

  const fetchToReplaceFrames = useCallback(
    async (ids: UUID[], targetPriority: number) => {
      try {
        const replacedPromises = ids.map(async (id) => {
          return getReplacedQuery({
            arg1: {
              targetPriority,
              stagingVehicleScheduleFrameId: id,
            },
          });
        });

        const replaced = (await Promise.all(replacedPromises)).flatMap(
          (response) =>
            response.data.toReplaceVehicleScheduleFrameIds
              ?.toReplaceVehicleScheduleFrameIds,
        );

        return compact(replaced);
      } catch (error) {
        log.error(error);
        return [];
      }
    },
    [getReplacedQuery],
  );

  return { fetchToReplaceFrames };
};
