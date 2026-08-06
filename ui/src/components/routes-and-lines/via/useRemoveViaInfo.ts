import { gql } from '@apollo/client';
import {
  RemoveScheduledStopPointViaInfoMutationVariables,
  useRemoveScheduledStopPointViaInfoMutation,
} from '../../../generated/graphql';
import { MutationHook, extendHook } from '../../../hooks';

const GQL_REMOVE_SCHEDULED_STOP_POINT_VIA_INFO = gql`
  mutation RemoveScheduledStopPointViaInfo(
    $stopLabel: String!
    $journeyPatternId: uuid!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: {
        is_via_point: false
        via_point_name_i18n: null
        via_point_short_name_i18n: null
      }
    ) {
      returning {
        ...ScheduledStopPointInJourneyPatternAllFields
      }
    }
  }
`;

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
