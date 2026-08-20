import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { usePatchScheduledStopPointViaInfoMutation } from '../../../../generated/graphql';
import { FormState } from './ViaForm';

const GQL_PATCH_SCHEDULED_STOP_POINT_VIA_INFO = gql`
  mutation PatchScheduledStopPointViaInfo(
    $stopLabel: String!
    $journeyPatternId: uuid!
    $patch: journey_pattern_scheduled_stop_point_in_journey_pattern_set_input!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: $patch
    ) {
      returning {
        ...ScheduledStopPointInJourneyPatternAllFields
      }
    }
  }
`;

type EditParams = {
  readonly form: FormState;
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
};

// Note: this will set the VIA info to _all_ of the instances of the stop with the given label
// within the journey pattern. E.g. if the bus travels in a loop and visits the same stop multiple
// times, all of those will have the same VIA info attached.
// In the future, we might want to clarify that which instance of the stop needs to get the VIA info,
// but as this is a very rare corner case for HSL, we'll go with this solution for now for simplicity.
export function useEditViaInfo() {
  const [updateViaInfo] = usePatchScheduledStopPointViaInfoMutation();

  return useCallback(
    ({ form, journeyPatternId, stopLabel }: EditParams) =>
      updateViaInfo({
        variables: {
          journeyPatternId,
          stopLabel,
          patch: {
            is_via_point: true,
            via_point_name_i18n: form.viaPointName,
            via_point_short_name_i18n: form.viaPointShortName,
          },
        },
      }),
    [updateViaInfo],
  );
}
