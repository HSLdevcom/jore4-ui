import { gql, useApolloClient } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  GetToReplaceVehicleScheduleFramesDocument,
  GetToReplaceVehicleScheduleFramesQuery,
  GetToReplaceVehicleScheduleFramesQueryVariables,
} from '../../../../../../generated/graphql';
import { TimetablePriority } from '../../../../../../types/enums';

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
  const apollo = useApolloClient();

  const fetchToReplaceFrames = useCallback(
    async (ids: ReadonlyArray<UUID>, targetPriority: TimetablePriority) => {
      try {
        const promisedIds = ids.map((id) =>
          apollo
            .query<
              GetToReplaceVehicleScheduleFramesQuery,
              GetToReplaceVehicleScheduleFramesQueryVariables
            >({
              query: GetToReplaceVehicleScheduleFramesDocument,
              variables: {
                arg1: { targetPriority, stagingVehicleScheduleFrameId: id },
              },
            })
            .then(
              (result) =>
                result.data.toReplaceVehicleScheduleFrameIds
                  ?.toReplaceVehicleScheduleFrameIds,
            )
            .then(compact),
        );

        return Promise.all(promisedIds).then((idLists) => idLists.flat());
      } catch (error) {
        throw new Error(
          `Failed to fetch to replace vehicle schedule frames: ${error}`,
        );
      }
    },
    [apollo],
  );

  return { fetchToReplaceFrames };
};
