import {
  RemoveScheduledStopPointViaInfoMutationVariables,
  useRemoveScheduledStopPointViaInfoMutation,
} from '../../generated/graphql';
import { MutationHook, extendHook } from '../mutationHook';

type RemoveParams = {
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
};

type RemoveChanges = {
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
};

// Note: this will remove the VIA info from _all_ of the instances of the stop with the given label
// within the journey pattern. E.g. if the bus travels in a loop and visits the same stop multiple
// times, all of those will have the VIA info removed.
// In the future, we might want to clarify that which instance of the stop needs to get the VIA info
// removed, but as this is a very rare corner case for HSL, we'll go with this solution for now.
export const useRemoveViaInfoHook: MutationHook<
  RemoveParams,
  RemoveChanges,
  RemoveScheduledStopPointViaInfoMutationVariables
> = () => {
  const [removeViaInfo] = useRemoveScheduledStopPointViaInfoMutation();

  const prepare = (params: RemoveParams): RemoveChanges => params;

  const mapChangesToVariables = (
    changes: RemoveChanges,
  ): RemoveScheduledStopPointViaInfoMutationVariables => changes;

  const executeMutation = (
    variables: RemoveScheduledStopPointViaInfoMutationVariables,
  ) =>
    removeViaInfo({
      variables,
    });

  return {
    prepare,
    mapChangesToVariables,
    executeMutation,
  };
};

export const useRemoveViaInfo = extendHook(useRemoveViaInfoHook);
