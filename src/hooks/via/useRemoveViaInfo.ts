import {
  RemoveScheduledStopPointViaInfoMutationVariables,
  useRemoveScheduledStopPointViaInfoMutation,
} from '../../generated/graphql';

// Note: this will remove the VIA info from _all_ of the instances of the stop with the given label
// within the journey pattern. E.g. if the bus travels in a loop and visits the same stop multiple
// times, all of those will have the VIA info removed.
// In the future, we might want to clarify that which instance of the stop needs to get the VIA info
// removed, but as this is a very rare corner case for HSL, we'll go with this solution for now.
export const useRemoveViaInfo = () => {
  const [removeViaInfo] = useRemoveScheduledStopPointViaInfoMutation();

  interface RemoveParams {
    journeyPatternId: UUID;
    stopLabel: string;
  }

  interface RemoveChanges {
    journeyPatternId: UUID;
    stopLabel: string;
  }

  const prepareRemove = (params: RemoveParams): RemoveChanges => params;

  const mapRemoveChangesToVariables = ({
    stopLabel,
    journeyPatternId,
  }: RemoveChanges): RemoveScheduledStopPointViaInfoMutationVariables => ({
    stopLabel,
    journeyPatternId,
  });

  const removeMutation = async (
    variables: RemoveScheduledStopPointViaInfoMutationVariables,
  ) => {
    await removeViaInfo({
      variables,
    });
  };

  return {
    prepareRemove,
    mapRemoveChangesToVariables,
    removeMutation,
  };
};
