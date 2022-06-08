import {
  RemoveScheduledStopPointViaInfoMutationVariables,
  useRemoveScheduledStopPointViaInfoMutation,
} from '../../generated/graphql';
import { removeFromApolloCache } from '../../utils';

export const useRemoveViaInfo = () => {
  const [removeViaInfo] = useRemoveScheduledStopPointViaInfoMutation();

  interface RemoveParams {
    scheduledStopPointId: UUID;
    journeyPatternId: UUID;
  }

  interface RemoveChanges {
    scheduledStopPointId: UUID;
    journeyPatternId: UUID;
  }

  const prepareRemoveViaInfo = (params: RemoveParams): RemoveChanges => {
    return params;
  };

  const mapRemoveViaInfoToVariables = ({
    scheduledStopPointId,
    journeyPatternId,
  }: RemoveChanges): RemoveScheduledStopPointViaInfoMutationVariables => {
    return {
      scheduled_stop_point_id: scheduledStopPointId,
      journey_pattern_id: journeyPatternId,
    };
  };

  const removeViaInfoMutation = async (
    variables: RemoveScheduledStopPointViaInfoMutationVariables,
  ) => {
    await removeViaInfo({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: variables.scheduled_stop_point_id,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });
  };

  return {
    prepareRemoveViaInfo,
    mapRemoveViaInfoToVariables,
    removeViaInfoMutation,
  };
};
